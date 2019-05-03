import { injectable } from 'smart-factory';
import { NodesInspectorModules } from './modules';
import { NodesInspectorTypes } from './types';

injectable(NodesInspectorModules.Inspect,
  [],
  async (): Promise<NodesInspectorTypes.Inspect> =>
    async () => {
    });