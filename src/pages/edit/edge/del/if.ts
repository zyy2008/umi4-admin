import { Args } from "../index";
import { Node } from "@antv/x6";
export default function handle(args: Args) {
  const { x6Graph, sourceCell, targetCell } = args;
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
