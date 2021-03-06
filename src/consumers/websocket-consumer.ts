import { injectable } from 'smart-factory';
import { ConsumerModules } from './modules';
import { ConsumerTypes } from './types';
import { ConfigModules, ConfigTypes } from '../configs';
import { LoggerModules, LoggerTypes } from '../loggers';
import { WebsocketModules, WebsocketTypes } from '../websockets';

const tag = '[websocket-consumer]';

injectable(ConsumerModules.Consumers.WebsocketConsumer,
  [ ConfigModules.TopicConfig,
    LoggerModules.Logger,
    WebsocketModules.WebsocketWrap ],
  async (cfg: ConfigTypes.TopicConfig,
    log: LoggerTypes.Logger,
    ws: WebsocketTypes.WebsocketWrap): Promise<ConsumerTypes.QueueConsumer> =>

  ({
    name: cfg.websocketMessageQueue,
    consume: async (payload: any) => {
      log.debug(`${tag} message payload received`);
      log.debug(payload);

      const roomToken = payload.topic;
      ws.to(roomToken).emit('message', payload.body);
      log.debug(`${tag} payload published to room`);
    }
  }));