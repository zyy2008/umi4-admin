import { Args } from "../index";
import { addEdge } from "./index";
import { XFlowGroupCommands, NsGroupCmd, uuidv4 } from "@antv/xflow";

export default async function handle(args: Args, isFor = true) {
  const { commandService, targetCell, sourceCell, x6Graph, edgeCell } = args;
  const { id: sourceId } = sourceCell;
  const { id: targetId } = targetCell;
  const { sourcePortId } = edgeCell?.getData();
  const port = sourceCell.getPort(sourcePortId);
  if (port?.group === "bottom") {
    const { group } = targetCell.getData();
    edgeCell?.setLabels("true");
    edgeCell?.setData({
      ...edgeCell.getData(),
      label: "true",
    });
    const groupId = group ? group : uuidv4();
    !group &&
      (await commandService.executeCommand<NsGroupCmd.AddGroup.IArgs>(
        XFlowGroupCommands.ADD_GROUP.id,
        {
          nodeConfig: {
            id: groupId,
            isCollapsed: false,
            groupChildren: [targetId],
            renderKey: "GroupNode",
            groupPadding: 40,
            groupHeaderHeight: 0,
            parent: true,
            init: true,
            label: isFor ? "" : (port.tooltip as string).split(":")[1],
          },
        }
      ));
    isFor &&
      addEdge({
        x6Graph,
        sourceId,
        targetId: groupId,
      });
  }
  if (port?.group === "left") {
    edgeCell?.setLabels("false");
    edgeCell?.setData({
      ...edgeCell.getData(),
      label: "false",
    });
  }
}
