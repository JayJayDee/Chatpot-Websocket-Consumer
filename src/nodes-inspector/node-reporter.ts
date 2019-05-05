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
const listKey = 'WS_NODES';

class WebsocketUnavailableError extends BaseLogicError {
  constructor() {
    super('WEBSOCKET_UNAVAILABLE', 'there is no available websocket node');
  }
}

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
      const status: NodesInspectorTypes.NodeStatus = {
        publicHost: hostCfg.websocket,
        privateHost: address(),
        port: wsCfg.port,
        numClient: 0
      };
      const client = await getRedisClient();
      await writeAlive(client, status);

      log.debug(`${tag} reported as a new websocket node`);
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


const getAllNodeStatuses =
  (client: RedisClient): Promise<NodesInspectorTypes.NodeStatus[]> =>
    new Promise((resolve, reject) => {
      client.lrange(listKey, 0, 100, (err, replies: any[]) => {
        if (err) return reject(err);
        const multi = client.multi();
        uniq(replies).forEach((r) => multi.get(r));
        multi.exec((err, datas) => {
          if (err) return reject(err);
          const parsed = datas
            .filter((d) => d)
            .map((d) => JSON.parse(d))
            .map((elem) => ({
              publicHost: elem.publicHost,
              privateHost: elem.privateHost,
              port: elem.port,
              numClient: elem.numClient
            }));
          resolve(parsed);
        });
      });
    });

const writeAlive =
  (client: RedisClient, status: NodesInspectorTypes.NodeStatus) =>
    new Promise((resolve, reject) => {
      const key = `${keyPrefix}${status.publicHost}:${status.port}`;
      client.get(key, (err, reply) => {
        if (err) return reject(err);
        if (reply) return resolve();
        client.set(key, JSON.stringify(status));
        client.rpush(listKey, key);
      });
    });