import { init, resolve } from 'smart-factory';
import { ConsumerTypes, ConsumerModules } from './consumers';

(async () => {
  await init({
    includes: [`${__dirname}/**/*.ts`, `${__dirname}/**/*.js`]
  });

  const runConsumers = resolve<ConsumerTypes.ConsumerRunner>(ConsumerModules.ConsumerRunner);
  runConsumers();
})();