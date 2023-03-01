import { IProps } from "@/components/flow";
import { APIS } from "@/services";
import type { Graph } from "@antv/x6";
import { formatChildren } from "@/utils";

export const commandConfig: IProps["commandConfig"] = (hooks) => {
  return [
    hooks.addEdge.registerHook({
      name: "get edge config from api",
      handler: async (args) => {
        args.createEdgeService = async (args) => {
          const { edgeConfig } = args;
          const { source } = edgeConfig;
          const { success, data } =
            await APIS.DefaultApi.kmsViewServerViewNodeAddPost({
              nodeId: isNaN(Number(source)) ? 0 : Number(source),
              newNodeName: "1",
            });
          console.log(args);
          if (success) {
            // const getX6Graph: Graph = await args.getX6Graph();
            return edgeConfig;
          } else {
            return false;
          }
        };
      },
    }),
    hooks.delNode.registerHook({
      name: "get edge config from backend api",
      handler: async (args) => {
        args.deleteNodeService = async (args: any) => {
          const { nodeConfig } = args;
          const { id } = nodeConfig;
          const { success = false } =
            await APIS.DefaultApi.kmsViewServerViewDeletePost({
              id: isNaN(Number(id)) ? 0 : Number(id),
            });
          if (success) {
            const getX6Graph: Graph = await args.getX6Graph();
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
