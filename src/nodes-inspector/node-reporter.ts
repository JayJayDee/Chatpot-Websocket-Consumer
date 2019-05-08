import { injectable } from 'smart-factory';
import { address } from 'ip';
import { uniq, minBy } from 'lodash';
import { NodesInspectorModules } from './modules';
import { KeyValueStorageModules, KeyValueStorageTypes } from '../kv-storage';
import { LoggerModules, LoggerTypes } from '../loggers';
import { NodesInspectorTypes } from './types';
import { ConfigModules, ConfigTypes } from '../configs';
import { RedisClient } from 'redis';
import { BaseLogicError } from '../errors';

const tag = '[ws-node-reporter]';
const keyPrefix = 'WS_NODE_';
const countKeyPostfix = '_COUNT';
const listKey = 'WS_NODES';

class WebsocketUnavailableError extends BaseLogicError {
  constructor() {
    super('WEBSOCKET_UNAVAILABLE', 'there is no available websocket node');
  }
}

let privAddr: string = null;
const privateAddress = () => {
  if (privAddr) return privAddr;
  privAddr = address();
  return privAddr;
};


injectable(NodesInspectorModules.ReportAlive,
  [ LoggerModules.Logger,
    KeyValueStorageModules.GetRedisClient,
    ConfigModules.WebsocketConfig,
    ConfigModules.HostConfig ],
  async (log: LoggerTypes.Logger,
    getRedisClient: KeyValueStorageTypes.GetRedisClient,
    wsCfg: ConfigTypes.WebsocketConfig,
    hostCfg: ConfigTypes.HostConfig): Promise<NodesInspectorTypes.ReportAlive> =>

    async () => {
      const status: NodesInspectorTypes.NodeStatusParam = {
        publicHost: hostCfg.websocket,
        privateHost: privateAddress(),
        port: wsCfg.port,
        publicPort: wsCfg.publicPort
      };
      const client = await getRedisClient();
      await writeAlive(client, status);
      log.debug(`${tag} reported as a new websocket node`);
    });


injectable(NodesInspectorModules.UpdateReport,
  [ LoggerModules.Logger,
    KeyValueStorageModules.Set,
    ConfigModules.HostConfig,
    ConfigModules.WebsocketConfig ],
  async (log: LoggerTypes.Logger,
    set: KeyValueStorageTypes.Set,
    hostCfg: ConfigTypes.HostConfig,
    wsCfg: ConfigTypes.WebsocketConfig): Promise<NodesInspectorTypes.UpdateReport> =>

    async (numClient) => {
      const status: NodesInspectorTypes.NodeStatusParam = {
        publicHost: hostCfg.websocket,
        privateHost: privateAddress(),
        port: wsCfg.port,
        publicPort: wsCfg.publicPort
      };
      await set(statusKey(status), JSON.stringify(status));
      await set(countKey(status), '0');
    });


injectable(NodesInspectorModules.PickHealthyNode,
  [ LoggerModules.Logger,
    KeyValueStorageModules.GetRedisClient ],
  async (log: LoggerTypes.Logger,
    getRedisClient: KeyValueStorageTypes.GetRedisClient): Promise<NodesInspectorTypes.PickHealthyNode> =>

    async () => {
      const client = await getRedisClient();
      const statuses = await getAllNodeStatuses(client);
      if (statuses.length === 0) throw new WebsocketUnavailableError();
      const node = minBy(statuses, (s) => s.numClient);
      return node;
    });


injectable(NodesInspectorModules.IncreaseConnection,
  [ LoggerModules.Logger,
    KeyValueStorageModules.GetRedisClient,
    ConfigModules.WebsocketConfig,
    ConfigModules.HostConfig ],
  async (log: LoggerTypes.Logger,
    getRedisClient: KeyValueStorageTypes.GetRedisClient,
    wsCfg: ConfigTypes.WebsocketConfig,
    hostCfg: ConfigTypes.HostConfig): Promise<NodesInspectorTypes.IncreaseConnection> =>

      () =>
        new Promise(async (resolve, reject) => {
          const status: NodesInspectorTypes.NodeStatusParam = {
            publicHost: hostCfg.websocket,
            privateHost: privateAddress(),
            port: wsCfg.port,
            publicPort: wsCfg.publicPort
          };
          const key = countKey(status);
          const client = await getRedisClient();

          client.incr(key, (err, reply) => {
            log.debug(`${tag} increased num_client number: ${statusKey(status)} => ${reply}`);
            if (err) return reject(err);
            resolve();
          });
        }));


injectable(NodesInspectorModules.DescreaseConnection,
  [ LoggerModules.Logger,
    KeyValueStorageModules.GetRedisClient,
    ConfigModules.WebsocketConfig,
    ConfigModules.HostConfig ],
  async (log: LoggerTypes.Logger,
    getRedisClient: KeyValueStorageTypes.GetRedisClient,
    wsCfg: ConfigTypes.WebsocketConfig,
    hostCfg: ConfigTypes.HostConfig): Promise<NodesInspectorTypes.DescreaseConnection> =>

      () =>
        new Promise(async (resolve, reject) => {
          const status: NodesInspectorTypes.NodeStatusParam = {
            publicHost: hostCfg.websocket,
            privateHost: privateAddress(),
            port: wsCfg.port,
            publicPort: wsCfg.publicPort
          };
          const key = countKey(status);
          const client = await getRedisClient();

          client.decr(key, (err, reply) => {
            log.debug(`${tag} decreased num_client number: ${statusKey(status)} => ${reply}`);
            if (err) return reject(err);
            resolve();
          });
        }));


const getAllNodeStatuses =
  (client: RedisClient): Promise<NodesInspectorTypes.NodeStatus[]> =>
    new Promise((resolve, reject) => {
      client.lrange(listKey, 0, 100, (err, replies: any[]) => {
        if (err) return reject(err);
        const multi = client.multi();
        const multiNumber = client.multi();
        uniq(replies).forEach((r) => multi.get(r));
        uniq(replies).map((r) => `${r}${countKeyPostfix}`).forEach((k) => multiNumber.get(k));

        multi.exec((err, datas) => {
          if (err) return reject(err);

          multiNumber.exec((err, numbers) => {
            if (err) return reject(err);

            let idx = 0;
            const parsed = datas
              .filter((d) => d)
              .map((d) => JSON.parse(d))
              .map((elem) => {
                const ret =  {
                  publicHost: elem.publicHost,
                  privateHost: elem.privateHost,
                  port: elem.port,
                  publicPort: elem.publicPort,
                  numClient: parseInt(numbers[idx])
                };
                idx++;
                return ret;
              });
            resolve(parsed);
          });
        });
      });
    });

const writeAlive =
  (client: RedisClient, status: NodesInspectorTypes.NodeStatusParam) =>
    new Promise((resolve, reject) => {
      const key = statusKey(status);
      const ckey = countKey(status);
      client.get(key, (err, reply) => {
        if (err) return reject(err);
        if (reply) {
          return client.multi()
            .set(key, JSON.stringify(status))
            .set(ckey, '0')
            .exec((err, reply) => {
              if (err) return reject(err);
              resolve();
            });
        }
        client.multi()
          .set(key, JSON.stringify(status))
          .set(ckey, '0')
          .rpush(listKey, key)
          .exec((err, reply) => {
            if (err) return reject(err);
            resolve();
          });
      });
    });

const statusKey = (status: NodesInspectorTypes.NodeStatusParam) =>
  `${keyPrefix}${status.publicHost}:${status.port}`;

const countKey = (status: NodesInspectorTypes.NodeStatusParam) =>
  `${statusKey(status)}${countKeyPostfix}`;