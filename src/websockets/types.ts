import { Socket } from 'socket.io';

export namespace WebsocketTypes {
  type SocketCallback = (socket: Socket) => void;

  export type WebsocketWrap = {
    on: (event: string, callback: SocketCallback) => void;
    listen: (port: number) => void;
  };

  export type WebsocketInstantiator = () => Promise<WebsocketWrap>;
  export type WebsocketRunner = () => void;
}