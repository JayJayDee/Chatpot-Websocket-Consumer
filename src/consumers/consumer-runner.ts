import { injectable } from 'smart-factory';
import { ConsumerModules } from './modules';
import { ConsumerTypes } from './types';
import { QueueModules, QueueTypes } from '../queues';

injectable(ConsumerModules.ConsumerRunner,
  [ ConsumerModules.AllConsumers,
    QueueModules.AmqpClient ],
  async (consumers: ConsumerTypes.QueueConsumer[],
    client: QueueTypes.AmqpClient): Promise<ConsumerTypes.ConsumerRunner> =>
      async () => {
        consumers.map((c) => client.subscribe(c.name, c.consume));
      });