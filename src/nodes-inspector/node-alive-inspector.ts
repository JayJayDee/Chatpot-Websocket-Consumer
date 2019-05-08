import { injectable } from 'smart-factory';
import { NodesInspectorModules } from './modules';
import { NodesInspectorTypes } from './types';
import { LoggerModules, LoggerTypes } from '../loggers';
import { KeyValueStorageModules, KeyValueStorageTypes } from '../kv-storage';
import * as io from 'socket.io-client';
import { RedisClient } from 'redis';

const tag = '[ws-node-inspector]';
const listKey = 'WS_NODES';

injectable(NodesInspectorModules.InspectionRunner,
  [ LoggerModules.Logger,
    NodesInspectorModules.Inspect ],
  async (log: LoggerTypes.Logger,
    inspect: NodesInspectorTypes.Inspect): Promise<NodesInspectorTypes.InspectionRunner> =>

    async () => {
      const period = 20;
      log.debug(`${tag} ws-inspector up and running, period:${period} sec`);
      setInterval(() => inspect(), period * 1000);
    });


injectable(NodesInspectorModules.Inspect,
  [ LoggerModules.Logger,
    KeyValueStorageModules.GetRedisClient ],
  async (log: LoggerTypes.Logger,
    getRedisClient: KeyValueStorageTypes.GetRedisClient): Promise<NodesInspectorTypes.Inspect> =>

    () =>
      new Promise((resolve, reject) => {
        let redisClient: RedisClient = null;
        getRedisClient()
        .then((client) => {
          redisClient = client;
          return getNodeStatuses(client);
        })
        .then((statuses) => {
          const promises = Object.keys(statuses).map((key) =>
            inspectNodeAlive(key, statuses[key]));
          return Promise.all(promises);
        })
        .then((results) => {
          const deads = results.filter((r) => r.alive === false);
          if (deads.length > 0) {
            const promises = deads.map((d) =>
              cleanUpDeads(redisClient, d.key));
            Promise.all(promises);
            log.debug(`${tag} inspection completed. all_node:${results.length} / dead:${promises.length}`);
            resolve();
          } else {
            Promise.resolve();
            log.debug(`${tag} inspection completed. all_node:${results.length} / dead:0`);
            resolve();
          }
        })
        .catch((err) => {
          reject(err);
        });
      }));


const cleanUpDeads = (client: RedisClient, key: string): Promise<void> =>
  new Promise((resolve, reject) => {
    client.multi()
      .lrem(listKey, 5, key)
      .del(key)
      .del(`${key}_COUNT`)
      .exec((err, resp) => {
        if (err) return reject(err);
        resolve();
      });
  });

type InspectionResult = {
  alive: boolean;
  key: string;
};

const inspectNodeAlive =
  (key: string, node: NodesInspectorTypes.NodeStatusParam): Promise<InspectionResult> =>
    new Promise((resolve, reject) => {
      let done = false;
      const socket = io.connect(`${node.publicHost}:${node.publicPort}`);

      setTimeout(() => {
        if (socket.connected === true) socket.disconnect();
        if (done === false) {
          done = true;
          return resolve({
            alive: false,
            key
          });
        }
      }, 10000);

      socket.on('connect', () => socket.emit('health_req', {}));
      socket.on('health_res', (payload: any) => {
        if (socket.connected === true) socket.disconnect();
        if (done === false) {
          done = true;
          return resolve({
            alive: true,
            key
          });
        }
      });
    });

const getNodeStatuses =
  (client: RedisClient): Promise<{ [key: string]: NodesInspectorTypes.NodeStatusParam }> =>
    new Promise((resolve, reject) => {
      client.lrange(listKey, 0, 100, (err, replies) => {
        if (err) return reject(err);
        const multi = client.multi();
        replies.forEach((r) => multi.get(r));
        multi.exec((err, statuses) => {
          if (err) return reject(err);
          const resp: { [key: string]: NodesInspectorTypes.NodeStatusParam } = {};
          let idx = 0;
          statuses.forEach((s: string) => {
            if (!s) return;
            const parsed = JSON.parse(s);
            const key = replies[idx];
            resp[key] = {
              publicHost: parsed.publicHost,
              privateHost: parsed.privateHost,
              port: parsed.port,
              publicPort: parsed.publicPort
            };
            idx++;
          });
          resolve(resp);
        });
      });
    });