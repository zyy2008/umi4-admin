import { Args } from "../index";

export default function handle(args: Args) {
  const { x6Graph, edgeCell, sourceCell } = args;
  const edges = x6Graph.getOutgoingEdges(sourceCell);
  if (edges && edges.length === 1) {
    edgeCell?.setLabels("true");
    edgeCell?.setData({
      ...edgeCell.getData(),
      label: "true",
    });
  } else {
    edgeCell?.setLabels("false");
    edgeCell?.setData({
      ...edgeCell.getData(),
      label: "false",
    });
  }
}
