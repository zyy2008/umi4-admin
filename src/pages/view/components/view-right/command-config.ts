import { IProps } from "@/components/flow";
import { APIS } from "@/services";
import type { Graph } from "@antv/x6";
import { formatChildren } from "@/utils";
import { XFlowNode } from "@/components/flow/node";

export const commandConfig: IProps["commandConfig"] = (hooks) => {
  return [
    hooks.addEdge.registerHook({
      name: "get edge config from api",
      handler: async (args) => {
        args.createEdgeService = async (args) => {
          const { edgeConfig } = args;
          const { source, target } = edgeConfig;
          const { success, data } =
            await APIS.DefaultApi.kmsViewServerViewNodeAddPost({
              nodeId: isNaN(Number(source)) ? 0 : Number(source),
              newNodeName: "1",
            });
          if (success) {
            const graph: Graph = await (args as any).getX6Graph();
            const targetCell = graph.getCellById(target);
            targetCell.setData({
              ...targetCell.getData(),
              id: `${data?.id}`,
            });
            graph.updateCellId(targetCell, `${data?.id}`);
            return {
              ...edgeConfig,
              target: `${data?.id}`,
            };
          } else {
            return false;
          }
        };
      },
    }),
    hooks.delNode.registerHook({
      name: "get edge config from backend api",
      handler: async (args) => {
        args.deleteNodeService = async (args) => {
          const { nodeConfig } = args;
          const { id } = nodeConfig;
          if (isNaN(Number(id))) {
            return true;
          }
          const { success = false } =
            await APIS.DefaultApi.kmsViewServerViewDeletePost({
              id: Number(id) ?? 0,
            });
          if (success) {
            const getX6Graph: Graph = await (args as any).getX6Graph();
            const edges = getX6Graph.getEdges().map((cell) => {
              return cell.getData();
            });
            const find = formatChildren(id, edges);
            const targets = find.map(({ target }) => target);
            targets.forEach((id) => {
              getX6Graph.removeNode(id);
            });
          }
          return success;
        };
      },
    }),
  ];
};
