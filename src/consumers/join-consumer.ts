import { injectable } from 'smart-factory';
import { ConsumerModules } from './modules';
import { ConfigModules, ConfigTypes } from '../configs';
import { LoggerModules, LoggerTypes } from '../loggers';
import { ConsumerTypes } from './types';

const tag = '[join-consumer]';

injectable(ConsumerModules.Consumers.JoinConsumer,
  [ LoggerModules.Logger,
    ConfigModules.TopicConfig ],
  async (log: LoggerTypes.Logger,
    cfg: ConfigTypes.TopicConfig): Promise<ConsumerTypes.QueueConsumer> =>

    ({
      name: cfg.websocketJoinQueue,
      async consume(payload: any) {
        log.debug(`${tag} payload arrived`);
        log.debug(payload);
      }
    }));