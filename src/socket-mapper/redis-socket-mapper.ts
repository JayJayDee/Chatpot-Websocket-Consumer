import { LoggerTypes } from '../loggers';
import { KeyValueStorageTypes } from '../kv-storage';
import { SocketMapperTypes } from './types';

const fromTokenToSocket = (memberToken: string) =>
 `MAP_T2S_${memberToken}`;

const fromSocketToToken = (socketId: string) =>
 `MAP_S2T_${socketId}`;

export default (log: LoggerTypes.Logger,
    getRedisClient: KeyValueStorageTypes.GetRedisClient): SocketMapperTypes.SocketMapper => {

      return {
        map: (socketId, memberToken) =>
          new Promise(async (resolve, reject) => {
            const client = await getRedisClient();
            client.multi()
              .set(fromTokenToSocket(memberToken), socketId)
              .set(fromSocketToToken(socketId), memberToken)
              .exec((err, reply) => {
                if (err) return reject(err);
                resolve();
              });
          }),

        unmap: (param) =>
          new Promise(async (resolve, reject) => {
            const client = await getRedisClient();
            if (param.memberToken) {
              client.get(fromTokenToSocket(param.memberToken), (err, socketId) => {
                if (err) return reject(err);
                client.del(fromTokenToSocket(param.memberToken));
                client.del(fromSocketToToken(socketId));
                resolve();
              });
            } else if (param.socketId) {
              client.get(fromSocketToToken(param.socketId), (err, memberToken) => {
                if (err) return reject(err);
                client.del(fromSocketToToken(param.socketId));
                client.del(fromTokenToSocket(memberToken));
                resolve();
              });
            }
          }),

        async fetchSocketId(memberToken: string) {
          return '';
        },
        async fetchMemberToken(socketId: string) {
          return '';
        }
      };
    };