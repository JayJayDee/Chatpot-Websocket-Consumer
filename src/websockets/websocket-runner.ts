import { injectable } from 'smart-factory';
import { createClient } from 'redis';
const io = require('socket.io');
const redisAdapter = require('socket.io-redis');

import { WebsocketModules } from './modules';
import { ConfigModules, ConfigTypes } from '../configs';
import { LoggerModules, LoggerTypes } from '../loggers';
import { RedisConnectionError } from './errors';

const tag = '[websocket]';

injectable(WebsocketModules.WebsocketRunner,
  [ LoggerModules.Logger,
    ConfigModules.WebsocketConfig ],
  async (log: LoggerTypes.Logger,
    cfg: ConfigTypes.WebsocketConfig) =>

    async () => {
      const ws = io();

      if (cfg.adapter === ConfigTypes.WebsocketAdapter.REDIS) {
        log.debug(`${tag} using socket.io-redis adapter..`);
        await inspectRedisConnection(cfg.redis);
        ws.adapter(redisAdapter(cfg.redis));
        log.debug(`${tag} socket.io-redis adapter created`);
      }
      io.listen(cfg.port);
      log.debug(`${tag} socket.io server started, port:${cfg.port}`);
    });

const inspectRedisConnection =
  (cfg: ConfigTypes.RedisConfig) =>
    new Promise((resolve, reject) => {
      if (cfg.password === null) delete cfg.password;
      const client = createClient(cfg);
      client.get('1', (err, reply) => {
        if (err) return reject(new RedisConnectionError(`connection failed: ${cfg.host}`));
        resolve();
      });
    });