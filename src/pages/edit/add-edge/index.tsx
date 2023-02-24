import { default as ifHandle } from "./if";
import { default as forHandle } from "./for";
import {
  NsEdgeCmd,
  IGraphCommandService,
  XFlowEdgeCommands,
  uuidv4,
  NsGraph,
} from "@antv/xflow";
import { Node, Graph } from "@antv/x6";

export type Args = {
  commandService: IGraphCommandService;
  sourceCell: Node;
  targetCell: Node;
  x6Graph: Graph;
};

export const addEdge = ({
  x6Graph,
  targetId,
  sourceId,
}: {
  x6Graph: Graph;
  targetId: string;
  sourceId: string;
}) => {
  x6Graph.addEdge({
    source: {
      cell: targetId,
      anchor: {
        name: "right",
      },
    },
    data: {
      renderKey: "循环",
    },
    router: {
      name: "oneSide",
      args: {
        side: "right",
      },
    },
    label: "循环",
    attrs: {
      line: {
        stroke: "#A2B1C3",
        strokeWidth: 2,
        targetMarker: {
          name: "block",
          width: 12,
          height: 8,
        },
      },
    },
    target: {
      cell: sourceId,
      anchor: {
        name: "right",
        args: {
          dx: -14,
        },
      },
    },
  });
};

export default {
  if: ifHandle,
  for: forHandle,
};
