import { injectable } from 'smart-factory';
import { extend } from 'lodash';
import { WebsocketModules } from './modules';
import { ConfigModules, ConfigTypes } from '../configs';
import { LoggerModules, LoggerTypes } from '../loggers';
import { WebsocketTypes } from './types';
import { NodesInspectorModules, NodesInspectorTypes } from '../nodes-inspector';
import { Socket } from 'socket.io';
import { ExtApiModules, ExtApiTypes } from '../extapis';
import { SocketMapperModules, SocketMapperTypes } from '../socket-mapper';

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
    NodesInspectorModules.DescreaseConnection,
    ExtApiModules.RequestMyRooms,
    SocketMapperModules.MapSocket,
    SocketMapperModules.UnmapSocket ],
  async (log: LoggerTypes.Logger,
    cfg: ConfigTypes.WebsocketConfig,
    hostCfg: ConfigTypes.HostConfig,
    ws: WebsocketTypes.WebsocketWrap,
    reportAlive: NodesInspectorTypes.ReportAlive,
    increase: NodesInspectorTypes.IncreaseConnection,
    decrease: NodesInspectorTypes.DescreaseConnection,
    requestMyRooms: ExtApiTypes.RequestMyRooms,
    map: SocketMapperTypes.MapSocket,
    unmap: SocketMapperTypes.UnmapSocket) =>

    async () => {
      log.debug(`${tag} websocket server starting...`);
      ws.listen(cfg.port);
      await reportAlive();

      const onConnect = connectionHandler(log, increase, ws);
      const onDisconnect = disconnectionHandler(log, decrease, ws, unmap);
      const onPostInit = postInitHandler(log, requestMyRooms, map);
      const onPublish = publishHandler(log);
      const onHealth = healthHandler(log);

      ws.on('connection', (socket) => {
        onConnect(socket);
        socket.on('disconnect', () => onDisconnect(socket));
        socket.on('postinit_req', (payload: any) => onPostInit(socket, payload));
        socket.on('publish', (payload: any) => onPublish(socket, payload));
        socket.on('health_req', (payload: any) => onHealth(socket, payload));
      });

      log.debug(`${tag} websocket server started, port:${cfg.port}`);
      log.debug(`${tag} websocket public host:${hostCfg.websocket}, public port:${cfg.publicPort}`);
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
    ws: WebsocketTypes.WebsocketWrap,
    unmap: SocketMapperTypes.UnmapSocket) =>
      (socket: Socket) => {
        decrease();
        const socketId = socket.id;

        // unmap socket_id - member_token pair.
        unmap({ socketId });

        log.debug(`${tag} disconnected, id=${socket.id}`);
      };

const postInitHandler =
  (log: LoggerTypes.Logger,
    getMyRooms: ExtApiTypes.RequestMyRooms,
    map: SocketMapperTypes.MapSocket) =>
      async (socket: Socket, payload: any) => {
        log.debug(`${tag} init requested, id=${socket.id}`);

        if (!payload.token) {
          emitError(socket, {
            code: 'INVALID_PARAM',
            message: 'payload with join request must have token'
          });
          return;
        }

        // join to room topics
        let rooms: string[] = null;
        try {
          rooms = await getMyRooms(payload.token);
        } catch (err) {
          emitError(socket, {
            code: 'INVALID_PARAM',
            message: 'invalid member_token'
          });
          return;
        }

        // map socket_id - member_token pair
        map(socket.id, payload.token);

        rooms.forEach((r) => socket.join(r));
        socket.emit('init_res', {
          success: true
        });
      };

const publishHandler = (log: LoggerTypes.Logger) =>
  (socket: Socket, payload: any) => {
    // TODO: to be implemented
  };

const healthHandler = (log: LoggerTypes.Logger) =>
  (socket: Socket, payload: any) => {
    log.debug(`${tag} health check requested`);
    socket.emit('health_res', {});
  };

const emitError = (socket: Socket, payload: ErrorPayload) =>
  socket.emit('server_error', extend(payload, { success: false }));