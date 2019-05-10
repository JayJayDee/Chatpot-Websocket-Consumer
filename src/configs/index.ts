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
    websocketMessageQueue: null,
    websocketJoinQueue: null
  },
  websocket: {
    port: null,
    adapter: null,
    redis: null,
    publicPort: null
  },
  kvStorage: {
    provider: null,
    redis: null
  },
  host: {
    websocket: null
  },
  http: {
    port: null
  },
  extapi: {
    roomBaseUri: null
  }
}));

// configuration rules.
injectable(ConfigModules.ConfigRules, [],
  async (): Promise<ConfigTypes.ConfigRule[]> => ([
    { key: 'AMQP_HOST', path: ['amqp', 'host'] },
    { key: 'AMQP_PORT', path: ['amqp', 'port'] },
    { key: 'AMQP_LOGIN', path: ['amqp', 'login']  },
    { key: 'AMQP_PASSWORD', path: ['amqp', 'password'] },
    { key: 'TOPIC_WEBSOCKET_JOIN_QUEUE', path: ['topic', 'websocketJoinQueue'] },
    { key: 'TOPIC_WEBSOCKET_MESSAGE_QUEUE', path: ['topic', 'websocketMessageQueue'] },
    { key: 'KV_STORAGE_PROVIDER', path: ['kvStorage', 'provider'], defaultValue: 'MEMORY' },
    { key: 'KV_STORAGE_REDIS_HOST', path: ['kvStorage', 'redis', 'host'], defaultValue: null },
    { key: 'KV_STORAGE_REDIS_PORT', path: ['kvStorage', 'redis', 'port'], defaultValue: null },
    { key: 'KV_STORAGE_REDIS_PASSWORD', path: ['kvStorage', 'redis', 'password'], defaultValue: null },
    { key: 'WEBSOCKET_PORT', path: ['websocket', 'port'] },
    { key: 'WEBSOCKET_PUBLIC_PORT', path: ['websocket', 'publicPort'] },
    { key: 'WEBSOCKET_ADAPTER', path: ['websocket', 'adapter'], defaultValue: 'MEMORY' },
    { key: 'WEBSOCKET_REDIS_HOST', path: ['websocket', 'redis', 'host'], defaultValue: null },
    { key: 'WEBSOCKET_REDIS_PORT', path: ['websocket', 'redis', 'port'], defaultValue: null },
    { key: 'WEBSOCKET_REDIS_PASSWORD', path: ['websocket', 'redis', 'password'], defaultValue: null },
    { key: 'HOST_WEBSOCKET', path: ['host', 'websocket'] },
    { key: 'HTTP_PORT', path: ['http', 'port'] },
    { key: 'EXTAPI_ROOM_URI', path: ['extapi', 'roomBaseUri'] }
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

injectable(ConfigModules.HostConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.host);

injectable(ConfigModules.HttpConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.http);

injectable(ConfigModules.ExtApiConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.extapi);

injectable(ConfigModules.Env,
  [ConfigModules.ConfigSource],
  async (src: ConfigTypes.ConfigSource) => {
    const envExpr = src['NODE_ENV'];
    if (!envExpr || envExpr === 'production') return ConfigTypes.Env.DEV;
    return ConfigTypes.Env.PROD;
  });