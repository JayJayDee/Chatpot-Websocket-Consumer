import { injectable } from 'smart-factory';
import { NodesInspectorModules } from './modules';
import { NodesInspectorTypes } from './types';
import { LoggerModules, LoggerTypes } from '../loggers';
import { KeyValueStorageModules, KeyValueStorageTypes } from '../kv-storage';
import * as io from 'socket.io-client';
import { RedisClient } from 'redis';

const tag = '[ws-node-inspector]';
const listKey = 'WS_NODES';

injectable(NodesInspectorModules.Inspect,
  [ LoggerModules.Logger,
    KeyValueStorageModules.GetRedisClient ],
  async (log: LoggerTypes.Logger,
    getRedisClient: KeyValueStorageTypes.GetRedisClient): Promise<NodesInspectorTypes.Inspect> =>

    () =>
      new Promise((resolve, reject) => {
        getRedisClient()
        .then((client) => getNodeStatuses(client))
        .then((statuses) => {
          console.log(statuses);
          console.log(io);
        })
        .catch((err) => {
          reject(err);
        });
      }));

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
              port: parsed.port
            };
            idx++;
          });
          resolve(resp);
        });
      });
    });

injectable(NodesInspectorModules.InspectionRunner,
  [ LoggerModules.Logger,
    NodesInspectorModules.Inspect ],
  async (log: LoggerTypes.Logger,
    inspect: NodesInspectorTypes.Inspect): Promise<NodesInspectorTypes.InspectionRunner> =>

    async () => {
      const period = 10;
      log.debug(`${tag} ws-inspector up and running, period:${period} sec`);
      setInterval(() => inspect(), period * 1000);
    });