import { IGraphCommandService } from "@antv/xflow";
import { Cell, Graph, Node, Edge } from "@antv/x6";

export type Args = {
  commandService: IGraphCommandService;
  sourceCell: Node;
  targetCell: Node;
  x6Graph: Graph;
  edgeCell?: Edge;
};

export { default as addEdge } from "./add";
export { default as delEdge } from "./del";
