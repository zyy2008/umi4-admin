import { Graph, Node, Cell } from "@antv/x6";
import { NsGraph } from "@antv/xflow";

export const connecting: Graph.Options["connecting"] = {
  validateConnection: function ({
    sourceView,
    targetView,
    sourceCell,
    targetCell,
    targetMagnet,
    sourceMagnet,
  }) {
    if (sourceView === targetView) {
      return false;
    }
    const targetPortId = targetMagnet?.getAttribute("port")!;
    if (!targetPortId) {
      return false;
    }
    const targetPort = (targetCell as Node).getPort(targetPortId);
    if (targetPort?.type === NsGraph.AnchorType.OUTPUT) {
      return false;
    }

    const sourcePortId = sourceMagnet?.getAttribute("port");
    if (!sourcePortId) {
      return false;
    }

    const sourcePort = (sourceCell as Node).getPort(sourcePortId);
    if (sourcePort?.type === NsGraph.AnchorType.INPUT) {
      return false;
    }

    const { renderKey: sourceKey } = sourceCell?.getData();
    const { renderKey: targetKey } = targetCell?.getData();
    if (sourceKey === "EndNode" && sourceKey === targetKey) {
      return false;
    }

    if (this.isPredecessor(sourceCell as Cell, targetCell as Cell)) {
      return false;
    }

    if (this.isSuccessor(sourceCell as Cell, targetCell as Cell)) {
      return false;
    }

    // 判断目标链接桩是否可连接
    if (targetMagnet) {
      const portId = targetMagnet.getAttribute("port");
      const port = (targetCell as Node).getPort(portId as string);
      return !(port && port.connected);
    }
    return false;
  },
};
