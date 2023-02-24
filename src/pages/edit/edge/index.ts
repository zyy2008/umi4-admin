import { IGraphCommandService } from "@antv/xflow";
import { Cell, Graph } from "@antv/x6";

export type Args = {
  commandService: IGraphCommandService;
  sourceCell: Cell;
  targetCell: Cell;
  x6Graph: Graph;
};

export { default as addEdge } from "./add";
export { default as delEdge } from "./del";
