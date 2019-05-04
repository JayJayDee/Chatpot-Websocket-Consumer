import { injectable } from 'smart-factory';
import { KeyValueStorageTypes } from './types';
import { KeyValueStorageModules } from './modules';
import { LoggerTypes, LoggerModules } from '../loggers';
import { ConfigTypes, ConfigModules } from '../configs';
import memoryCacheFactory from './memory-driver';
import redisCacheFactory from './redis-driver';

const tag = '[kv-storage]';

export const initCache =
  async (cfg: ConfigTypes.KeyValueStorageConfig,
    logger: LoggerTypes.Logger,
    getRedisConnection: KeyValueStorageTypes.GetRedisClient): Promise<KeyValueStorageTypes.StorageOperations> => {
      let cacheOps: KeyValueStorageTypes.StorageOperations = null;
      const initMemory = memoryCacheFactory();
      const initRedis = redisCacheFactory(cfg.redis, logger);

      if (cfg.provider === ConfigTypes.CacheProvider.MEMORY) {
        logger.debug(`${tag} using in-memory driver..`);
        cacheOps = await initMemory(logger);
      } else if (cfg.provider === ConfigTypes.CacheProvider.REDIS) {
        logger.debug(`${tag} using redis driver..`);
        const client = await getRedisConnection();
        cacheOps = await initRedis(client);
      }
      return cacheOps;
    };

injectable(KeyValueStorageModules.Operations,
  [ ConfigModules.KeyValueStorageConfig,
    LoggerModules.Logger,
    KeyValueStorageModules.GetRedisClient ],
  initCache);

injectable(KeyValueStorageModules.Get,
  [ KeyValueStorageModules.Operations ],
  async (ops: KeyValueStorageTypes.StorageOperations) => ops.get);

injectable(KeyValueStorageModules.Set,
  [ KeyValueStorageModules.Operations ],
  async (ops: KeyValueStorageTypes.StorageOperations) => ops.set);

injectable(KeyValueStorageModules.Push,
  [ KeyValueStorageModules.Operations ],
  async (ops: KeyValueStorageTypes.StorageOperations) => ops.push);

injectable(KeyValueStorageModules.Range,
  [ KeyValueStorageModules.Operations ],
  async (ops: KeyValueStorageTypes.StorageOperations) => ops.range);

injectable(KeyValueStorageModules.Del,
  [ KeyValueStorageModules.Operations ],
  async (ops: KeyValueStorageTypes.StorageOperations) => ops.del);

injectable(KeyValueStorageModules.Length,
  [ KeyValueStorageModules.Operations ],
  async (ops: KeyValueStorageTypes.StorageOperations) => ops.length);

injectable(KeyValueStorageModules.GetLasts,
  [ KeyValueStorageModules.Operations ],
  async (ops: KeyValueStorageTypes.StorageOperations) => ops.getLasts);

export { KeyValueStorageTypes } from './types';
export { KeyValueStorageModules } from './modules';