import { Args } from "../index";
export default async function handle(args: Args) {
  const { x6Graph, targetCell } = args;
  const targetEdges = x6Graph.getOutgoingEdges(targetCell);
  if (targetEdges && targetEdges.length > 0) {
    const [edge] = targetEdges;
    edge.remove();
  }
}
