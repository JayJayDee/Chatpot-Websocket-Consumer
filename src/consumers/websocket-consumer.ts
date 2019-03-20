import { injectable } from 'smart-factory';
import { ConsumerModules } from './modules';
import { ConsumerTypes } from './types';
import { ConfigModules, ConfigTypes } from '../configs';

injectable(ConsumerModules.Consumers.WebsocketConsumer,
  [ ConfigModules.TopicConfig ],
  async (cfg: ConfigTypes.TopicConfig): Promise<ConsumerTypes.QueueConsumer> =>

  ({
    name: cfg.websocketMessageQueue,
    consume: async (payload: any) => {
      console.log(payload);
    }
  }));