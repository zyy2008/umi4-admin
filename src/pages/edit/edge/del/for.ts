import { Args } from "../index";
import { NsGraph } from "@antv/xflow";

export default async function handle(args: Args) {
  const { x6Graph, targetCell } = args;
  const { group }: NsGraph.INodeConfig = targetCell.getData();
  if (group) {
    const groupCell = x6Graph.getCellById(group);
    groupCell.remove();
  }
}
