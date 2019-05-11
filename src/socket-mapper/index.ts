import { injectable } from 'smart-factory';
import { SocketMapperModules } from './modules';
import { SocketMapperTypes } from './types';
import { LoggerModules, LoggerTypes } from '../loggers';
import { KeyValueStorageModules, KeyValueStorageTypes } from '../kv-storage';

import redisSocketMapper from './redis-socket-mapper';

injectable(SocketMapperModules.SocketMapper,
  [ LoggerModules.Logger,
    KeyValueStorageModules.GetRedisClient ],
  async (log: LoggerTypes.Logger,
    getRedisClient: KeyValueStorageTypes.GetRedisClient): Promise<SocketMapperTypes.SocketMapper> =>
      redisSocketMapper(log, getRedisClient));


injectable(SocketMapperModules.MapSocket,
  [ SocketMapperModules.SocketMapper ],
  async (mapper: SocketMapperTypes.SocketMapper): Promise<SocketMapperTypes.MapSocket> =>
    mapper.map);


injectable(SocketMapperModules.UnmapSocket,
  [ SocketMapperModules.SocketMapper ],
  async (mapper: SocketMapperTypes.SocketMapper): Promise<SocketMapperTypes.UnmapSocket> =>
    mapper.unmap);


injectable(SocketMapperModules.FetchSocketId,
  [ SocketMapperModules.SocketMapper ],
  async (mapper: SocketMapperTypes.SocketMapper): Promise<SocketMapperTypes.FetchSocketId> =>
    mapper.fetchSocketId);


injectable(SocketMapperModules.FetchMemberToken,
  [ SocketMapperModules.SocketMapper ],
  async (mapper: SocketMapperTypes.SocketMapper): Promise<SocketMapperTypes.FetchMemberToken> =>
    mapper.fetchMemberToken);


export { SocketMapperModules } from './modules';
export { SocketMapperTypes } from './types';

