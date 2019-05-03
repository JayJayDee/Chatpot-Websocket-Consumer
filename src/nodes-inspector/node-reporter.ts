import { injectable } from 'smart-factory';
import { NodesInspectorModules } from './modules';
import { KeyValueStorageModules, KeyValueStorageTypes } from '../kv-storage';
import { LoggerModules, LoggerTypes } from '../loggers';
import { NodesInspectorTypes } from './types';

injectable(NodesInspectorModules.ReportAlive,
  [ LoggerModules.Logger,
    KeyValueStorageModules.Push,
    KeyValueStorageModules.Set ],
  async (log: LoggerTypes.Logger,
    kvPush: KeyValueStorageTypes.Push,
    kvSet: KeyValueStorageTypes.Set): Promise<NodesInspectorTypes.ReportAlive> =>

    async (status) => {
      // TODO: to be implemented
    });


injectable(NodesInspectorModules.PickHealthyNode,
  [],
  async (): Promise<NodesInspectorTypes.PickHealthyNode> =>
    async () => {
      // TODO: to be implemented.
      return null;
    });