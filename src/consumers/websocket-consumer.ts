import { injectable } from 'smart-factory';
import { ConsumerModules } from './modules';
import { ConsumerTypes } from './types';

const name = 'websocket-consumer';

injectable(ConsumerModules.Consumers.WebsocketConsumer,
  [],
  async (): Promise<ConsumerTypes.QueueConsumer> =>

  ({
    name,
    consume: async (payload: any) => {
      console.log(payload);
    }
  }));