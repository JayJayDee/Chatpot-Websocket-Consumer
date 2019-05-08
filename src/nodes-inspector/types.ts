export namespace NodesInspectorTypes {
  export type NodeStatus = {
    publicHost: string;
    privateHost: string;
    port: number;
    publicPort: number;
    numClient: number;
  };

  export type NodeStatusParam = {
    publicHost: string;
    privateHost: string;
    port: number;
    publicPort: number;
  };

  export type Inspect = () => Promise<void>;
  export type InspectionRunner = () => Promise<void>;
  export type ReportAlive = () => Promise<void>;
  export type UpdateReport = (numClient: number) => Promise<void>;
  export type PickHealthyNode = () => Promise<NodeStatus>;

  export type IncreaseConnection = () => Promise<void>;
  export type DescreaseConnection = () => Promise<void>;
}