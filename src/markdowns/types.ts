import { Handler } from 'express';

export namespace MarkdownTypes {
  export type SocketIODocs = () => Handler;
}