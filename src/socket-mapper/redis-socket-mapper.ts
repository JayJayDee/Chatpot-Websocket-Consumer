import { LoggerTypes } from '../loggers';
import { KeyValueStorageTypes } from '../kv-storage';
import { SocketMapperTypes } from './types';

export default (log: LoggerTypes.Logger,
    getRedisClient: KeyValueStorageTypes.GetRedisClient): SocketMapperTypes.SocketMapper => {

      return {
        async map(socketId, memberToken) {

        },
        async unmap(socketId, memberToken) {

        },
        async fetchSocketId(memberToken: string) {
          return '';
        },
        async fetchMemberToken(socketId: string) {
          return '';
        }
      };
    };