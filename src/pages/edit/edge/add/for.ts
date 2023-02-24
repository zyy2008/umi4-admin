import { Args } from "../index";
import { addEdge } from "./index";
import {
  XFlowGroupCommands,
  NsGroupCmd,
  uuidv4,
  NsGraph,
  XFlowNodeCommands,
  NsNodeCmd,
} from "@antv/xflow";

export default async function handle(args: Args) {
  const { commandService, targetCell, sourceCell, x6Graph } = args;
  const { id: sourceId } = sourceCell;
  const { id: targetId } = targetCell;
  const groupId = uuidv4();
  await commandService.executeCommand<NsGroupCmd.AddGroup.IArgs>(
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
      },
    }
  );
  addEdge({
    x6Graph,
    sourceId,
    targetId: groupId,
  });
}
