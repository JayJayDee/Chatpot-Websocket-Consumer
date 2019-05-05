import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { NodesInspectorModules, NodesInspectorTypes } from '../nodes-inspector';

injectable(EndpointModules.Node.Status,
  [ EndpointModules.Utils.WrapAync,
    NodesInspectorModules.PickHealthyNode ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    pickHealthyNode: NodesInspectorTypes.PickHealthyNode): Promise<EndpointTypes.Endpoint> =>

    ({
      uri: '/status',
      method: EndpointTypes.EndpointMethod.GET,
      handler: [
        wrapAsync(async (req, res, next) => {
          const node = await pickHealthyNode();
          res.status(200).json({
            websocket_host: node.publicHost,
            num_connection: node.numClient
          });
        })
      ]
    }));