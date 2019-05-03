import { injectable } from 'smart-factory';
import { NodesInspectorModules } from './modules';
import { NodesInspectorTypes } from './types';
import { LoggerModules, LoggerTypes } from '../loggers';

const tag = '[ws-node-inspector]';

injectable(NodesInspectorModules.Inspect,
  [ LoggerModules.Logger ],
  async (log: LoggerTypes.Logger): Promise<NodesInspectorTypes.Inspect> =>

    async () => {

    });


injectable(NodesInspectorModules.InspectionRunner,
  [ LoggerModules.Logger,
    NodesInspectorModules.Inspect ],
  async (log: LoggerTypes.Logger,
    inspect: NodesInspectorTypes.Inspect): Promise<NodesInspectorTypes.InspectionRunner> =>

    async () => {
      const period = 10;
      log.debug(`${tag} ws-inspector up and running, period:${period} sec`);
      setInterval(() => inspect(), period * 1000);
    });