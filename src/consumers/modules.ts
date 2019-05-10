export namespace ConsumerModules {
  export const AllConsumers = 'Consumer/AllConsumers';
  export const ConsumerRunner = 'Consumer/ConsumerRunner';

  export enum Consumers {
    WebsocketConsumer = 'Consumer/WebsocketConsumer',
    JoinConsumer = 'Consumer/JoinConsumer'
  }
}