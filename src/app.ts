import { init, resolve } from 'smart-factory';
import { ConsumerTypes, ConsumerModules } from './consumers';
import { WebsocketTypes, WebsocketModules } from './websockets';

(async () => {
  await init({
    includes: [`${__dirname}/**/*.ts`, `${__dirname}/**/*.js`]
  });

  const runConsumers = resolve<ConsumerTypes.ConsumerRunner>(ConsumerModules.ConsumerRunner);
  const runWebsockets = resolve<WebsocketTypes.WebsocketRunner>(WebsocketModules.WebsocketRunner);

  runConsumers();
  runWebsockets();
})();