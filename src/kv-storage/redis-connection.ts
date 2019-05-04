import { injectable } from 'smart-factory';
import { KeyValueStorageModules } from './modules';
import { KeyValueStorageTypes } from './types';
import { ConfigTypes, ConfigModules } from '../configs';
import { RedisClient, createClient } from 'redis';
import { RedisConnectionError } from './errors';
import { LoggerModules, LoggerTypes } from '../loggers';

const tag = '[kv-storage-redis]';

injectable(KeyValueStorageModules.GetRedisClient,
  [ LoggerModules.Logger,
    ConfigModules.KeyValueStorageConfig ],
  async (log: LoggerTypes.Logger,
    cfg: ConfigTypes.KeyValueStorageConfig): Promise<KeyValueStorageTypes.GetRedisClient> =>

    () =>
      new Promise((resolve, reject) => {
        if (cfg.provider !== ConfigTypes.CacheProvider.REDIS) return resolve(null);

        if (!cfg.redis.password) delete cfg.redis.password;
        const client: RedisClient = createClient(cfg.redis);

        log.info(`${tag} establishing redis connection ...`);

        client.get('1', (err, reply) => {
          if (err) return reject(new RedisConnectionError(err.message));
          log.info(`${tag} redis connection established`);
          resolve(client);
        });
      }));