import { injectable } from 'smart-factory';
import { WebsocketModules } from './modules';
import { ConfigModules, ConfigTypes } from '../configs';
import { LoggerModules, LoggerTypes } from '../loggers';
import { WebsocketTypes } from './types';
import { NodesInspectorModules, NodesInspectorTypes } from '../nodes-inspector';

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
      ws.on('connection', (socket) => {
        log.debug(`${tag} connected, id=${socket.id}`);
        socket.on('disconnect', () => {
          log.debug(`${tag} disconnected, id=${socket.id}`);
        });
        socket.on('test', (payload) => {
          log.debug(`${tag} test topic published. ${payload}`);
        });
      });
    };