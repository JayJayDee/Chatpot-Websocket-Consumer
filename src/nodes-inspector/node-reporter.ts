import { injectable } from 'smart-factory';
import { address } from 'ip';
import { NodesInspectorModules } from './modules';
import { KeyValueStorageModules, KeyValueStorageTypes } from '../kv-storage';
import { LoggerModules, LoggerTypes } from '../loggers';
import { NodesInspectorTypes } from './types';
import { ConfigModules, ConfigTypes } from '../configs';

const tag = '[ws-node-reporter]';
const keyPrefix = 'WS_NODE_';

injectable(NodesInspectorModules.ReportAlive,
  [ LoggerModules.Logger,
    KeyValueStorageModules.Push,
    KeyValueStorageModules.Set,
    ConfigModules.WebsocketConfig,
    ConfigModules.HostConfig ],
  async (log: LoggerTypes.Logger,
    kvPush: KeyValueStorageTypes.Push,
    kvSet: KeyValueStorageTypes.Set,
    wsCfg: ConfigTypes.WebsocketConfig,
    hostCfg: ConfigTypes.HostConfig): Promise<NodesInspectorTypes.ReportAlive> =>

    async () => {
      const status: NodesInspectorTypes.NodeStatus = {
        publicHost: hostCfg.websocket,
        privateHost: address(),
        port: wsCfg.port,
        numClient: 0
      };

      const key = `${keyPrefix}${status.privateHost}:${status.port}`;
      await kvPush('WS_NODES', key, 100);
      await kvSet(key, status);
      log.debug(`${tag} reported as a new websocket node`);
    });


injectable(NodesInspectorModules.PickHealthyNode,
  [ LoggerModules.Logger,
    KeyValueStorageModules.GetRedisClient ],
  async (log: LoggerTypes.Logger,
    getRedisClient: KeyValueStorageTypes.GetRedisClient): Promise<NodesInspectorTypes.PickHealthyNode> =>

    async () => {
      log.debug(`${tag} picking a health ws-node..`);
      // TODO: to be implemented.
      return null;
    });