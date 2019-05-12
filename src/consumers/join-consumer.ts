import { injectable } from 'smart-factory';
import { ConsumerModules } from './modules';
import { ConfigModules, ConfigTypes } from '../configs';
import { LoggerModules, LoggerTypes } from '../loggers';
import { ConsumerTypes } from './types';
import { WebsocketModules, WebsocketTypes } from '../websockets';
import { SocketMapperModules, SocketMapperTypes } from '../socket-mapper';

const tag = '[join-consumer]';

injectable(ConsumerModules.Consumers.JoinConsumer,
  [ LoggerModules.Logger,
    ConfigModules.TopicConfig,
    WebsocketModules.WebsocketWrap,
    SocketMapperModules.FetchSocketId ],
  async (log: LoggerTypes.Logger,
    cfg: ConfigTypes.TopicConfig,
    ws: WebsocketTypes.WebsocketWrap,
    fetchSocketId: SocketMapperTypes.FetchSocketId): Promise<ConsumerTypes.QueueConsumer> =>

    ({
      name: cfg.websocketJoinQueue,
      async consume(payload: any) {
        log.debug(`${tag} joins payload arrived`);
        log.debug(payload);

        const memberToken = payload.member_token;
        const roomToken = payload.topic;
        const type = payload.type;

        const socketId = await fetchSocketId(memberToken);
        if (!socketId) {
          log.debug(`${tag} socket was destroyed. ignore it`);
          return;
        }

        const socket = ws.sockets.sockets[socketId];
        if (!socket) {
          log.debug(`${tag} socket not found with socket_id:${socketId}`);
          return;
        }

        if (type === 'SUBSCRIBE') {
          socket.join(roomToken);
          log.debug(`${tag} member:${memberToken}, socket_id:${socketId} joined room:${roomToken}`);
        } else if (type === 'UNSUBSCRIBE') {
          socket.leave(roomToken);
          log.debug(`${tag} member:${memberToken}, socket_id:${socketId} left from room:${roomToken}`);
        }
      }
    }));