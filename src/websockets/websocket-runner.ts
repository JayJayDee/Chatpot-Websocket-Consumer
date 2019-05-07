import { injectable } from 'smart-factory';
import { WebsocketModules } from './modules';
import { ConfigModules, ConfigTypes } from '../configs';
import { LoggerModules, LoggerTypes } from '../loggers';
import { WebsocketTypes } from './types';
import { NodesInspectorModules, NodesInspectorTypes } from '../nodes-inspector';
import { Socket } from 'socket.io';

const tag = '[websocket]';

type ErrorPayload = {
  code: string;
  message: string;
};

injectable(WebsocketModules.WebsocketRunner,
  [ LoggerModules.Logger,
    ConfigModules.WebsocketConfig,
    ConfigModules.HostConfig,
    WebsocketModules.WebsocketWrap,
    NodesInspectorModules.ReportAlive,
    NodesInspectorModules.IncreaseConnection,
    NodesInspectorModules.DescreaseConnection ],
  async (log: LoggerTypes.Logger,
    cfg: ConfigTypes.WebsocketConfig,
    hostCfg: ConfigTypes.HostConfig,
    ws: WebsocketTypes.WebsocketWrap,
    reportAlive: NodesInspectorTypes.ReportAlive,
    increase: NodesInspectorTypes.IncreaseConnection,
    decrease: NodesInspectorTypes.DescreaseConnection) =>

    async () => {
      ws.listen(cfg.port);
      await reportAlive();

      const onConnect = connectionHandler(log, increase, ws);
      const onDisconnect = disconnectionHandler(log, decrease, ws);
      const onJoin = joinHandler(log);
      const onPublish = publishHandler(log);

      ws.on('connection', (socket) => {
        onConnect(socket);
        socket.on('disconnect', () => onDisconnect(socket));
        socket.on('join', (payload: any) => onJoin(socket, payload));
        socket.on('publish', (payload: any) => onPublish(socket, payload));
      });

      log.debug(`${tag} websocket server started, port:${cfg.port}`);
      log.debug(`${tag} websocket public host: ${hostCfg.websocket}`);
    });

const connectionHandler =
  (log: LoggerTypes.Logger,
    increase: NodesInspectorTypes.IncreaseConnection,
    ws: WebsocketTypes.WebsocketWrap) =>
      (socket: Socket) => {
        increase();
        log.debug(`${tag} connected, id=${socket.id}`);
      };

const disconnectionHandler =
  (log: LoggerTypes.Logger,
    decrease: NodesInspectorTypes.DescreaseConnection,
    ws: WebsocketTypes.WebsocketWrap) =>
      (socket: Socket) => {
        decrease();
        log.debug(`${tag} disconnected, id=${socket.id}`);
      };

const joinHandler = (log: LoggerTypes.Logger) =>
  (socket: Socket, payload: any) => {
    log.debug(`${tag} join requested, id=${socket.id}`);

    if (!payload.token) {
      emitError(socket, {
        code: 'INVALID_PARAM',
        message: 'payload with join request must have token'
      });
    }
    // TODO: to be implemented
  };

const publishHandler = (log: LoggerTypes.Logger) =>
  (socket: Socket, payload: any) => {
    // TODO: to be implemented
  };

const emitError = (socket: Socket, payload: ErrorPayload) =>
  socket.emit('server_error', payload);