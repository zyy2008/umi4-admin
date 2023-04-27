import { Args } from "../index";

export default async function handle(args: Args) {
  const { targetCell, edgeCell } = args;
  const targetPortId = edgeCell?.getTargetPortId() as string;
  targetCell.setPortProp(targetPortId, "connected", false);
}
