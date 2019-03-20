import { injectable } from 'smart-factory';
import { ConsumerModules } from './modules';
import { ConsumerTypes } from './types';
import { ConfigModules, ConfigTypes } from '../configs';
import { LoggerModules, LoggerTypes } from '../loggers';

injectable(ConsumerModules.Consumers.WebsocketConsumer,
  [ ConfigModules.TopicConfig,
    LoggerModules.Logger ],
  async (cfg: ConfigTypes.TopicConfig,
    log: LoggerTypes.Logger): Promise<ConsumerTypes.QueueConsumer> =>

  ({
    name: cfg.websocketMessageQueue,
    consume: async (payload: any) => {
      console.log(payload);
    }
  }));