import { injectable } from 'smart-factory';
import { ConsumerModules } from './modules';
import { ConsumerTypes } from './types';

injectable(ConsumerModules.AllConsumers,
  [ ConsumerModules.Consumers.WebsocketConsumer ],
  async (wsConsumer): Promise<ConsumerTypes.QueueConsumer[]> =>
    [
      wsConsumer
    ]);

export { ConsumerTypes } from './types';
export { ConsumerModules } from './modules';