export namespace SocketMapperTypes {
  export type MapSocket = (socketId: string, memberToken: string) => Promise<void>;
  export type UnmapSocket = (socketId: string, memberToken: string) => Promise<void>;
  export type FetchSocketId = (memberToken: string) => Promise<string>;
  export type FetchMemberToken = (socketId: string) => Promise<string>;

  export type SocketMapper = {
    map: MapSocket;
    unmap: UnmapSocket;
    fetchSocketId: FetchSocketId;
    fetchMemberToken: FetchMemberToken;
  };
}