export namespace ConfigTypes {
  export type RootConfig = {
    amqp: AmqpConfig;
    topic: TopicConfig;
    websocket: WebsocketConfig;
  };
  export type AmqpConfig = {
    host: string;
    port: number;
    login: string;
    password: string;
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
  export type WebsocketConfig = {
    port: number;
  };
  export type ConfigSource = {[key: string]: any};
  export type ConfigReader = () => Promise<ConfigSource>;
  export type ConfigParser = (src: ConfigSource, rules: ConfigRule[]) => RootConfig;
  export type EnvReader = (src: ConfigSource) => Env;
}