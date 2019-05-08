export namespace ConfigTypes {
  export type RootConfig = {
    amqp: AmqpConfig;
    topic: TopicConfig;
    websocket: WebsocketConfig;
    kvStorage: KeyValueStorageConfig;
    host: HostConfig;
    http: HttpConfig;
  };
  export type AmqpConfig = {
    host: string;
    port: number;
    login: string;
    password: string;
  };
  export type HttpConfig = {
    port: number;
  };
  export enum Env {
    DEV = 'DEV',
    PROD = 'PROD'
  }
  export type ConfigRule = {
    key: string;
    path: string[];
    defaultValue?: any;
  };
  export type TopicConfig = {
    deviceQueue: string;
    websocketMessageQueue: string;
  };
  export enum WebsocketAdapter {
    MEMORY = 'MEMEORY', REDIS = 'REDIS'
  }
  export type WebsocketConfig = {
    port: number;
    publicPort: number;
    adapter: WebsocketAdapter;
    redis?: RedisConfig;
  };
  export type KeyValueStorageConfig = {
    provider: CacheProvider;
    redis?: RedisConfig;
  };
  export type RedisConfig = {
    host: string;
    port: number;
    password?: string;
  };
  export type HostConfig = {
    websocket: string;
  };
  export enum CacheProvider {
    MEMORY = 'MEMORY', REDIS = 'REDIS'
  }
  export type ConfigSource = {[key: string]: any};
  export type ConfigReader = () => Promise<ConfigSource>;
  export type ConfigParser = (src: ConfigSource, rules: ConfigRule[]) => RootConfig;
  export type EnvReader = (src: ConfigSource) => Env;
}