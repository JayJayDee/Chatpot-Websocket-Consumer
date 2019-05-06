import { injectable } from 'smart-factory';
import { NodesInspectorModules } from './modules';
import { NodesInspectorTypes } from './types';
import { LoggerModules, LoggerTypes } from '../loggers';
import { KeyValueStorageModules, KeyValueStorageTypes } from '../kv-storage';

const tag = '[ws-node-inspector]';
const listKey = 'WS_NODES';

injectable(NodesInspectorModules.Inspect,
  [ LoggerModules.Logger,
    KeyValueStorageModules.GetRedisClient ],
  async (log: LoggerTypes.Logger,
    getRedisClient: KeyValueStorageTypes.GetRedisClient): Promise<NodesInspectorTypes.Inspect> =>

    () =>
      new Promise((resolve, reject) => {
        getRedisClient().then((client) => {
          client.lrange(listKey, 0, 100, (err, replies) => {
            if (err) return reject(err);
            console.log(replies.length);
          });
        });
      }));


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