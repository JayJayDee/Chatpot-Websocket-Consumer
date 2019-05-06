export namespace NodesInspectorTypes {
  export type NodeStatus = {
    publicHost: string;
    privateHost: string;
    port: number;
    numClient: number;
  };

  export type Inspect = () => Promise<void>;
  export type InspectionRunner = () => Promise<void>;
  export type ReportAlive = () => Promise<void>;
  export type UpdateReport = (numClient: number) => Promise<void>;
  export type PickHealthyNode = () => Promise<NodeStatus>;
}