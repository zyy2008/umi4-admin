import { createCmdConfig, DisposableCollection } from "@antv/xflow";
import { MockApi } from "./service";

export const useCmdConfig = createCmdConfig((config) => {
  // 设置hook
  config.setRegisterHookFn((hooks) => {
    const list = [
      hooks.graphMeta.registerHook({
        name: "get graph meta from backend",
        handler: async (args) => {
          args.graphMetaService = MockApi.queryGraphMeta;
        },
      }),
      hooks.saveGraphData.registerHook({
        name: "save graph data",
        handler: async (args) => {
          if (!args.saveGraphDataService) {
            args.saveGraphDataService = MockApi.saveGraphData;
          }
        },
      }),
      hooks.addNode.registerHook({
        name: "get node config from backend api",
        handler: async (args) => {
          args.createNodeService = MockApi.addNode;
        },
      }),
      hooks.delNode.registerHook({
        name: "get edge config from backend api",
        handler: async (args) => {
          args.deleteNodeService = MockApi.delNode;
        },
      }),
      hooks.addEdge.registerHook({
        name: "get edge config from backend api",
        handler: async (args) => {
          args.createEdgeService = MockApi.addEdge;
        },
      }),
      hooks.delEdge.registerHook({
        name: "get edge config from backend api",
        handler: async (args) => {
          args.deleteEdgeService = MockApi.delEdge;
        },
      }),
    ];
    const toDispose = new DisposableCollection();
    toDispose.pushAll(list);
    return toDispose;
  });
});
