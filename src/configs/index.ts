import { injectable } from 'smart-factory';
import { ConfigModules } from './modules';
import { ConfigTypes } from './types';

export { ConfigModules } from './modules';
export { ConfigTypes } from './types';

injectable(ConfigModules.EmptyConfig, [], async (): Promise<ConfigTypes.RootConfig> => ({
  amqp: {
    host: null,
    port: null,
    login: null,
    password: null
  },
  topic: {
    deviceQueue: null,
    firebaseMessageQueue: null
  }
}));

// configuration rules.
injectable(ConfigModules.ConfigRules, [],
  async (): Promise<ConfigTypes.ConfigRule[]> => ([
    { key: 'AMQP_HOST', path: ['amqp', 'host'] },
    { key: 'AMQP_PORT', path: ['amqp', 'port'] },
    { key: 'AMQP_LOGIN', path: ['amqp', 'login']  },
    { key: 'AMQP_PASSWORD', path: ['amqp', 'password'] },
    { key: 'TOPIC_DEVICE_QUEUE', path: ['topic', 'deviceQueue'] },
    { key: 'TOPIC_FIREBASE_MESSAGE_QUEUE', path: ['topic', 'firebaseMessageQueue'] }
  ]));

injectable(ConfigModules.ConfigSource,
  [ConfigModules.ConfigReader],
  async (read: ConfigTypes.ConfigReader) => read());

injectable(ConfigModules.RootConfig,
  [ConfigModules.ConfigParser,
   ConfigModules.ConfigSource,
   ConfigModules.ConfigRules],
  async (parse: ConfigTypes.ConfigParser,
    src: ConfigTypes.ConfigSource,
    rules: ConfigTypes.ConfigRule[]): Promise<ConfigTypes.RootConfig> => parse(src, rules));

injectable(ConfigModules.AmqpConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.amqp);

injectable(ConfigModules.TopicConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.topic);

injectable(ConfigModules.Env,
  [ConfigModules.ConfigSource],
  async (src: ConfigTypes.ConfigSource) => {
    const envExpr = src['NODE_ENV'];
    if (!envExpr || envExpr === 'production') return ConfigTypes.Env.DEV;
    return ConfigTypes.Env.PROD;
  });