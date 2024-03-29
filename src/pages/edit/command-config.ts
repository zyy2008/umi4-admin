import { IProps } from "@/components/flow";
import {
  NsEdgeCmd,
  NsNodeCmd,
  IGraphCommandService,
  NsGraph,
} from "@antv/xflow";
import { Node, Graph as X6Graph } from "@antv/x6";
import { addEdge, delEdge } from "./edge";

type NodeType =
  | "if"
  | "for"
  | "while"
  | "switch"
  | "targetStart"
  | "sourceStart";

export const commandConfig: IProps["commandConfig"] = (hooks) => {
  return [
    hooks.delEdge.registerHook({
      name: "after del edge and del others",
      after: "after del edge",
      handler: async (_, handler: any) => {
        const main = async (args: any) => {
          const res = (await handler(args)) as NsEdgeCmd.DelEdge.IResult;
          const commandService: IGraphCommandService = args.commandService;
          const { sourceCell, sourcePortId } = res;
          if (sourceCell && sourceCell.isNode() && sourcePortId) {
            let { label, renderKey } =
              sourceCell.getData() as NsGraph.INodeConfig;
            const x6Graph = (await args.getX6Graph()) as X6Graph;
            if (renderKey === "StartNode") {
              label = "sourceStart";
            }
            delEdge?.[label as NodeType]?.({
              commandService,
              x6Graph,
              sourceCell,
              targetCell: res.targetCell as any,
            });
          }

          return res;
        };
        return main;
      },
    }),
    hooks.addEdge.registerHook({
      name: "after add edge add add others",
      after: "after add edge",
      handler: async (_, handler: any) => {
        const main = async (args: any) => {
          const res = (await handler(args)) as NsEdgeCmd.AddEdge.IResult;
          const commandService: IGraphCommandService = args.commandService;
          const { edgeConfig, edgeCell } = res;
          if (edgeCell && edgeConfig) {
            const sourceCell = edgeCell.getSourceCell() as Node;
            const targetCell = edgeCell.getTargetCell() as Node;
            const { renderKey: targetRenderKey } =
              targetCell.getData() as NsGraph.INodeConfig;
            let { label, renderKey: sourceRenderKey } =
              sourceCell.getData() as NsGraph.INodeConfig;
            if (targetRenderKey === "StartNode") {
              label = "targetStart";
            }
            if (sourceRenderKey === "StartNode") {
              label = "sourceStart";
            }
            const x6Graph = (await args.getX6Graph()) as X6Graph;
            addEdge?.[label as NodeType]?.({
              commandService,
              x6Graph,
              sourceCell,
              targetCell,
              edgeCell,
            });
          }
          return res;
        };
        return main;
      },
    }),
  ];
};
