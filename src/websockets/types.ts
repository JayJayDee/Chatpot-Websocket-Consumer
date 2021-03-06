import { Socket } from 'socket.io';

export namespace WebsocketTypes {
  type SocketCallback = (socket: Socket) => void;
  type ClientsCallback = (err: Error, clients: string[]) => void;

  type IoGlobalTo = {
    emit: (event: string, payload: any) => void
  };

  export type WebsocketWrap = {
    on: (event: string, callback: SocketCallback) => void;
    listen: (port: number) => void;
    clients: (callback: ClientsCallback) => void;
    of: (uri: string) => {
      adapter: {
        clients: (callback: ClientsCallback) => void;
      }
    };
    to: (roomId: string) => IoGlobalTo;
    sockets: {
      sockets: {[socketId: string]: Socket};
    }
  };

  export type WebsocketInstantiator = () => Promise<WebsocketWrap>;
  export type WebsocketRunner = () => void;

  export type NodeStatus = {
    publicHost: string;
    privateHost: string;
    port: number;
    numClient: number;
  };
  export type NodeStatusHandler = (status: NodeStatus) => Promise<void>;
}