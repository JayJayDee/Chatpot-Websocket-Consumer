export namespace ConsumerTypes {
  export type QueueConsumer = {
    name: string;
    consume: (payload: any) => Promise<void>;
  };
  export type ConsumerRunner = () => Promise<void>;
}