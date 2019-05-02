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
    websocketMessageQueue: null
  },
  websocket: {
    port: null
  },
  kvStorage: {
    provider: null,
    redis: null
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
    { key: 'TOPIC_WEBSOCKET_MESSAGE_QUEUE', path: ['topic', 'websocketMessageQueue'] },
    { key: 'WEBSOCKET_PORT', path: ['websocket', 'port'] },
    { key: 'KV_STORAGE_PROVIDER', path: ['kvStorage', 'provider'], defaultValue: 'MEMORY' },
    { key: 'KV_STORAGE_REDIS_HOST', path: ['kvStorage', 'redis', 'host'], defaultValue: null },
    { key: 'KV_STORAGE_REDIS_PORT', path: ['kvStorage', 'redis', 'port'], defaultValue: null },
    { key: 'KV_STORAGE_REDIS_PASSWORD', path: ['kvStorage', 'redis', 'password'], defaultValue: null }
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

injectable(ConfigModules.WebsocketConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.websocket);

injectable(ConfigModules.KeyValueStorageConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.kvStorage);

injectable(ConfigModules.Env,
  [ConfigModules.ConfigSource],
  async (src: ConfigTypes.ConfigSource) => {
    const envExpr = src['NODE_ENV'];
    if (!envExpr || envExpr === 'production') return ConfigTypes.Env.DEV;
    return ConfigTypes.Env.PROD;
  });