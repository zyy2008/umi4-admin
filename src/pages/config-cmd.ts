import {
  createCmdConfig,
  DisposableCollection,
  NsEdgeCmd,
  NsNodeCmd,
} from "@antv/xflow";
import { Shape, Edge } from "@antv/x6";
import { MockApi } from "./service";
import { ReactShape } from "@antv/x6-react-shape";
import { NsGraph, XFlowConstants } from "@antv/xflow-core";
import { XFlowNode } from "./node";

const { AnchorGroup } = NsGraph;

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
        after: "dag-add-node",
        handler: async (args) => {
          const cellFactory: NsNodeCmd.AddNode.IArgs["cellFactory"] = async (
            nodeConfig
          ) => {
            const node = new XFlowNode({
              ...nodeConfig,
            });
            return node;
          };
          args.createNodeService = MockApi.addNode;
          args.cellFactory = cellFactory;
        },
      }),
      hooks.delNode.registerHook({
        name: "get edge config from backend api",
        handler: async (args) => {
          args.deleteNodeService = MockApi.delNode;
        },
      }),
      hooks.addEdge.registerHook({
        name: "dag-add-edge-after",
        after: "dag-add-edge",
        handler: async (args) => {
          const cellFactory: NsEdgeCmd.AddEdge.IArgs["cellFactory"] = async (
            edgeConfig
          ) => {
            const edge = new Shape.Edge({
              ...edgeConfig,
              id: edgeConfig.id,
              source: {
                cell: edgeConfig.source,
                port: edgeConfig.sourcePortId,
              },
              target: {
                cell: edgeConfig.target,
                port: edgeConfig.targetPortId,
              },
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
              data: { ...edgeConfig },
              zIndex: 0,
            });
            console.log(edge);
            return edge;
          };
          args.cellFactory = cellFactory;
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
