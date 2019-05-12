import { injectable } from 'smart-factory';
import { ConsumerModules } from './modules';
import { ConfigModules, ConfigTypes } from '../configs';
import { LoggerModules, LoggerTypes } from '../loggers';
import { ConsumerTypes } from './types';
import { WebsocketModules, WebsocketTypes } from '../websockets';

const tag = '[join-consumer]';

injectable(ConsumerModules.Consumers.JoinConsumer,
  [ LoggerModules.Logger,
    ConfigModules.TopicConfig,
    WebsocketModules.WebsocketWrap ],
  async (log: LoggerTypes.Logger,
    cfg: ConfigTypes.TopicConfig,
    ws: WebsocketTypes.WebsocketWrap): Promise<ConsumerTypes.QueueConsumer> =>

    ({
      name: cfg.websocketJoinQueue,
      async consume(payload: any) {
        log.debug(`${tag} joins payload arrived`);
        log.debug(payload);

        //       { type: 'SUBSCRIBE', or 'UNSUBSCRIBE'
        // member_token: 'a6b365d853295c532f988916fb5413a2ab64a39c831c0292',
        // topic: '26ef038d7696b09ec88bd788a64fbc2e5de58333a3785c98' }
      }
    }));