import {
  createCmdConfig,
  DisposableCollection,
  NsEdgeCmd,
  NsNodeCmd,
} from "@antv/xflow";
import { Shape, Node } from "@antv/x6";
import { MockApi } from "./service";
import { XFlowNode } from "./node";
import type { Graph as X6Graph } from "@antv/x6";
import type { IProps } from "./index";

export const useCmdConfig = createCmdConfig<IProps>((config, proxy) => {
  // 设置hook
  const { connectionType = "one-to-one", commandConfig } = proxy.getValue();
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
            edgeCfg
          ) => {
            const edgeConfig = { ...edgeCfg, edge: null };
            const edge = new Shape.Edge({
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
      hooks.delEdge.registerHook({
        name: "after del edge",
        after: "afetr del edge, reset target node port props",
        handler: async (args, handler: any) => {
          const newHandler = async (handlerArgs: any) => {
            const result: NsEdgeCmd.DelEdge.IResult = await handler(
              handlerArgs
            );
            const { sourceCell, sourcePortId, targetCell, targetPortId } =
              result;
            if (targetCell && targetCell.isNode() && targetPortId) {
              targetCell.setData({
                ...targetCell.getData(),
                ports: targetCell.getParsedPorts(),
              });
            }
            if (sourceCell && sourceCell.isNode() && sourcePortId) {
              sourceCell.setPortProp(sourcePortId, "connected", false);
              sourceCell.setData({
                ...sourceCell.getData(),
                ports: sourceCell.getParsedPorts(),
              });
              const { label } = sourceCell.getData();
              if (label && label === "if") {
                const x6Graph = (await handlerArgs.getX6Graph()) as X6Graph;
                const edges = x6Graph.getOutgoingEdges(sourceCell);
                if (edges && edges.length > 0) {
                  const [edge] = edges;
                  const sourcePortId = edge.getSourcePortId() as string;
                  const targetPortId = edge.getTargetPortId() as string;
                  const targetCell = edge.getTargetCell() as Node;
                  targetCell.setPortProp(targetPortId, "connected", false);
                  sourceCell.setPortProp(sourcePortId, "connected", false);
                  targetCell.setData({
                    ...targetCell.getData(),
                    ports: targetCell.getParsedPorts(),
                  });
                  sourceCell.setData({
                    ...sourceCell.getData(),
                    ports: sourceCell.getParsedPorts(),
                  });
                  edge.remove();
                }
              }
            }
            return result;
          };
          return newHandler;
        },
      }),
      ...(commandConfig?.(hooks) ?? []),
    ];
    if (connectionType === "one-to-one") {
      list.push(
        hooks.addEdge.registerHook({
          name: "after add edge",
          after: "after add edge, set target port props",
          handler: async (_, handler: any) => {
            const main = async (args: any) => {
              const res = (await handler(args)) as NsEdgeCmd.AddEdge.IResult;
              if (res && res.edgeCell) {
                const targetNode = res.edgeCell.getTargetCell() as Node;
                const getSourceCell = res.edgeCell.getSourceCell() as Node;
                const portId = res.edgeCell.getSourcePortId() as string;
                getSourceCell.setPortProp(portId, "connected", true);
                getSourceCell.setData({
                  ...getSourceCell.getData(),
                  ports: getSourceCell.getParsedPorts(),
                });
                targetNode.setData({
                  ...targetNode.getData(),
                  ports: targetNode.getParsedPorts(),
                });
                const { label } = getSourceCell.getData();
                if (label && label === "if") {
                  const x6Graph = (await args.getX6Graph()) as X6Graph;
                  const edges = x6Graph.getOutgoingEdges(getSourceCell);
                  if (edges && edges.length === 1) {
                    res.edgeCell.setLabels("true");
                    res.edgeCell.setData({
                      ...res.edgeCell.getData(),
                      label: "true",
                    });
                  } else {
                    res.edgeCell.setLabels("false");
                    res.edgeCell.setData({
                      ...res.edgeCell.getData(),
                      label: "false",
                    });
                  }
                }
              }
              return res;
            };
            return main;
          },
        })
      );
    }
    const toDispose = new DisposableCollection();
    toDispose.pushAll(list);
    return toDispose;
  });
});
