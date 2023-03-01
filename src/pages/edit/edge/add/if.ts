import { Args } from "../index";
import { NsGraph } from "@antv/xflow";

export default function handle(args: Args) {
  const { x6Graph, edgeCell, sourceCell } = args;
  const sourcePortId = edgeCell?.getSourcePortId();
  const { ports } = sourceCell.getData();
  const [{ group }] = (ports as NsGraph.INodeAnchor[]).filter(
    (item) => item.id === sourcePortId
  );

  if (group === "left") {
    edgeCell?.setLabels("true");
    edgeCell?.setData({
      ...edgeCell.getData(),
      label: "true",
    });
  }
  if (group === "right") {
    edgeCell?.setLabels("false");
    edgeCell?.setData({
      ...edgeCell.getData(),
      label: "false",
    });
  }
}
