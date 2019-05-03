export namespace NodesInspectorTypes {
  export type NodeStatus = {
    publicHost: string;
    privateHost: string;
    port: number;
    numClient: number;
  };

  export type Inspect = () => Promise<void>;
  export type InspectionRunner = () => Promise<void>;
  export type ReportAlive = (status: NodeStatus) => Promise<void>;
  export type PickHealthyNode = () => Promise<NodeStatus>;
}