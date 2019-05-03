import { injectable } from 'smart-factory';
import { createClient } from 'redis';
const io = require('socket.io');
const redisAdapter = require('socket.io-redis');

import { WebsocketModules } from './modules';
import { ConfigModules, ConfigTypes } from '../configs';
import { LoggerModules, LoggerTypes } from '../loggers';
import { RedisConnectionError } from './errors';
import { WebsocketTypes } from './types';

const tag = '[websocket-instantiator]';

injectable(WebsocketModules.WebsocketWrap,
  [ LoggerModules.Logger,
    ConfigModules.WebsocketConfig ],
  async (log: LoggerTypes.Logger,
    cfg: ConfigTypes.WebsocketConfig): Promise<WebsocketTypes.WebsocketWrap> => {
      const ws = io();
      log.debug(`${tag} socket.io instance creating..`);

      if (cfg.adapter === ConfigTypes.WebsocketAdapter.REDIS) {
        log.debug(`${tag} using socket.io-redis adapter..`);
        await inspectRedisConnection(cfg.redis);
        ws.adapter(redisAdapter(cfg.redis));
        log.debug(`${tag} socket.io-redis adapter set`);
      }
      return ws;
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