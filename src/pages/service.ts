/* eslint-disable @typescript-eslint/no-unused-vars */
import { DND_RENDER_ID, NODE_WIDTH, NODE_HEIGHT } from "./constants";
import { uuidv4, NsGraph, NsGraphStatusCommand } from "@antv/xflow";
import type { NsNodeCmd, NsEdgeCmd, NsGraphCmd } from "@antv/xflow";
/** mock 后端接口调用 */
export namespace MockApi {
  export const NODE_COMMON_PROPS = {
    renderKey: DND_RENDER_ID,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  } as const;

  /** 查图的meta元信息 */
  export const queryGraphMeta: NsGraphCmd.GraphMeta.IArgs["graphMetaService"] =
    async (args) => {
      return { ...args, flowId: args.meta?.flowId ?? "" };
    };

  /** 保存图数据的api */
  export const saveGraphData: NsGraphCmd.SaveGraphData.IArgs["saveGraphDataService"] =
    async (meta: NsGraph.IGraphMeta, graphData: NsGraph.IGraphData) => {
      console.log("saveGraphData api", meta, graphData);
      return {
        success: true,
        data: graphData,
      };
    };

  /** 添加节点api */
  export const addNode: NsNodeCmd.AddNode.IArgs["createNodeService"] = async (
    args: NsNodeCmd.AddNode.IArgs
  ) => {
    console.info("addNode service running, add node:", args);
    const portItems = [
      {
        type: NsGraph.AnchorType.INPUT,
        group: NsGraph.AnchorGroup.TOP,
        tooltip: "输入桩",
      },
      {
        type: NsGraph.AnchorType.OUTPUT,
        group: NsGraph.AnchorGroup.BOTTOM,
        tooltip: "输出桩",
      },
    ] as NsGraph.INodeAnchor[];

    const { id, ports = portItems, groupChildren } = args.nodeConfig;
    const nodeId = id || uuidv4();
    /** 这里添加连线桩 */
    const node: NsNodeCmd.AddNode.IArgs["nodeConfig"] = {
      ...NODE_COMMON_PROPS,
      ...args.nodeConfig,
      id: nodeId,
      ports: (ports as NsGraph.INodeAnchor[]).map((port) => {
        return { ...port, id: uuidv4() };
      }),
    };
    console.log(node);
    /** group没有链接桩 */
    if (groupChildren && groupChildren.length) {
      node.ports = [];
    }
    return node;
  };

  /** 删除节点的api */
  export const delNode: NsNodeCmd.DelNode.IArgs["deleteNodeService"] = async (
    args
  ) => {
    console.info("delNode service running, del node:", args.nodeConfig.id);
    return true;
  };

  /** 添加边的api */
  export const addEdge: NsEdgeCmd.AddEdge.IArgs["createEdgeService"] = async (
    args
  ) => {
    console.info("addEdge service running, add edge:", args);
    const { edgeConfig } = args;
    return {
      ...edgeConfig,
      id: uuidv4(),
    };
  };

  /** 删除边的api */
  export const delEdge: NsEdgeCmd.DelEdge.IArgs["deleteEdgeService"] = async (
    args
  ) => {
    console.info("delEdge service running, del edge:", args);
    return true;
  };

  let runningNodeId = 0;
  const statusMap = {} as NsGraphStatusCommand.IStatusInfo["statusMap"];
  let graphStatus: NsGraphStatusCommand.StatusEnum =
    NsGraphStatusCommand.StatusEnum.DEFAULT;
  export const graphStatusService: NsGraphStatusCommand.IArgs["graphStatusService"] =
    async () => {
      if (runningNodeId < 4) {
        statusMap[`node${runningNodeId}`] = {
          status: NsGraphStatusCommand.StatusEnum.SUCCESS,
        };
        statusMap[`node${runningNodeId + 1}`] = {
          status: NsGraphStatusCommand.StatusEnum.PROCESSING,
        };
        runningNodeId += 1;
        graphStatus = NsGraphStatusCommand.StatusEnum.PROCESSING;
      } else {
        runningNodeId = 0;
        statusMap.node4 = { status: NsGraphStatusCommand.StatusEnum.SUCCESS };
        graphStatus = NsGraphStatusCommand.StatusEnum.SUCCESS;
      }
      return {
        graphStatus: graphStatus,
        statusMap: statusMap,
      };
    };
  export const stopGraphStatusService: NsGraphStatusCommand.IArgs["graphStatusService"] =
    async () => {
      Object.entries(statusMap).forEach(([, val]) => {
        const { status } = val as { status: NsGraphStatusCommand.StatusEnum };
        if (status === NsGraphStatusCommand.StatusEnum.PROCESSING) {
          val.status = NsGraphStatusCommand.StatusEnum.ERROR;
        }
      });
      return {
        graphStatus: NsGraphStatusCommand.StatusEnum.ERROR,
        statusMap: statusMap,
      };
    };
}
