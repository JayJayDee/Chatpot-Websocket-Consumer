import { init, resolve } from 'smart-factory';
import { ConsumerTypes, ConsumerModules } from './consumers';
import { WebsocketTypes, WebsocketModules } from './websockets';
import { NodesInspectorTypes, NodesInspectorModules } from './nodes-inspector';
import { EndpointTypes, EndpointModules } from './endpoints';

(async () => {
  await init({
    includes: [`${__dirname}/**/*.ts`, `${__dirname}/**/*.js`]
  });

  const runConsumers = resolve<ConsumerTypes.ConsumerRunner>(ConsumerModules.ConsumerRunner);
  const runWebsockets = resolve<WebsocketTypes.WebsocketRunner>(WebsocketModules.WebsocketRunner);
  const runWsInspection = resolve<NodesInspectorTypes.InspectionRunner>(NodesInspectorModules.InspectionRunner);
  const runHttp = resolve<EndpointTypes.EndpointRunner>(EndpointModules.EndpointRunner);

  runConsumers();
  runWebsockets();
  runWsInspection();
  runHttp();
})();