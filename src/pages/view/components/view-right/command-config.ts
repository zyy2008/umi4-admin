import { IProps } from "@/components/flow";
import { APIS } from "@/services";
import { message } from "antd";

export const commandConfig: IProps["commandConfig"] = (hooks) => {
  return [
    hooks.addEdge.registerHook({
      name: "get edge config from  api",
      handler: async (args) => {
        args.createEdgeService = async (args) => {
          const { edgeConfig } = args;
          const { source } = edgeConfig;
          const { success } = await APIS.DefaultApi.viewNodeAddPost(
            {
              nodeId: isNaN(Number(source)) ? 0 : Number(source),
              newNodeName: "123",
            },
            { prefix: "/atlas" }
          );
          if (success) {
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
        args.deleteNodeService = async (args) => {
          const { nodeConfig } = args;
          const { id } = nodeConfig;
          const { success = false } = await APIS.DefaultApi.viewDeletePost(
            {
              id: isNaN(Number(id)) ? 0 : Number(id),
            },
            { prefix: "/atlas" }
          );
          return success;
        };
      },
    }),
  ];
};
