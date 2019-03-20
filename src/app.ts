import { init, resolve } from 'smart-factory';
import { ConfigTypes, ConfigModules } from './configs';

(async () => {
  await init({
    includes: [`${__dirname}/**/*.ts`, `${__dirname}/**/*.js`]
  });

  const cfg: ConfigTypes.RootConfig =
    resolve<ConfigTypes.RootConfig>(ConfigModules.RootConfig);
  console.log(cfg);
})();