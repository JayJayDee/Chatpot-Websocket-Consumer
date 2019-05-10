import { injectable } from 'smart-factory';
import { ConsumerModules } from './modules';
import { ConsumerTypes } from './types';

injectable(ConsumerModules.AllConsumers,
  [ ConsumerModules.Consumers.WebsocketConsumer,
    ConsumerModules.Consumers.JoinConsumer ],
  async (wsConsumer, joinConsumer): Promise<ConsumerTypes.QueueConsumer[]> =>
    [
      wsConsumer,
      joinConsumer
    ]);

export { ConsumerTypes } from './types';
export { ConsumerModules } from './modules';