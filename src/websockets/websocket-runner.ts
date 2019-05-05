import { injectable } from 'smart-factory';
import { WebsocketModules } from './modules';
import { ConfigModules, ConfigTypes } from '../configs';
import { LoggerModules, LoggerTypes } from '../loggers';
import { WebsocketTypes } from './types';
import { NodesInspectorModules, NodesInspectorTypes } from '../nodes-inspector';
import { Socket } from 'socket.io';

const tag = '[websocket]';

injectable(WebsocketModules.WebsocketRunner,
  [ LoggerModules.Logger,
    ConfigModules.WebsocketConfig,
    ConfigModules.HostConfig,
    WebsocketModules.WebsocketWrap,
    NodesInspectorModules.ReportAlive ],
  async (log: LoggerTypes.Logger,
    cfg: ConfigTypes.WebsocketConfig,
    hostCfg: ConfigTypes.HostConfig,
    ws: WebsocketTypes.WebsocketWrap,
    reportAlive: NodesInspectorTypes.ReportAlive) =>

    async () => {
      const register = eventRegisterer(log);

      register(ws); // TEST-PURPOSE

      ws.listen(cfg.port);
      await reportAlive();

      log.debug(`${tag} websocket server started, port:${cfg.port}`);
      log.debug(`${tag} websocket public host: ${hostCfg.websocket}`);
    });

const eventRegisterer =
  (log: LoggerTypes.Logger) =>
    (ws: WebsocketTypes.WebsocketWrap) => {
      const onConnect = connectionHandler(log);
      const onDisconnect = disconnectionHandler(log);
      const onJoin = joinHandler(log);

      ws.on('connection', (socket) => {
        onConnect(socket);
        socket.on('disconnect', () => onDisconnect(socket));
        socket.on('join', (payload: any) => onJoin(socket, payload));
      });
    };

const connectionHandler = (log: LoggerTypes.Logger) =>
  (socket: Socket) => {
    log.debug(`${tag} connected, id=${socket.id}`);
  };

const disconnectionHandler = (log: LoggerTypes.Logger) =>
  (socket: Socket) => {
    log.debug(`${tag} disconnected, id=${socket.id}`);
  };

const joinHandler = (log: LoggerTypes.Logger) =>
  (socket: Socket, payload: any) => {
    log.debug(`${tag} join requested, id=${socket.id}`);
  };