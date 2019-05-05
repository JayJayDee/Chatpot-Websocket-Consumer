import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';

// register endpoints to container.
injectable(EndpointModules.Endpoints,
  [ EndpointModules.Node.Status ],

  async (status: EndpointTypes.Endpoint) =>

    ([
      status
    ]));

export { EndpointTypes } from './types';
export { EndpointModules } from './modules';