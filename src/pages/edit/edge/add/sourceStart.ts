import { Args } from "../index";
import { XFlowGroupCommands, NsGroupCmd, uuidv4 } from "@antv/xflow";

export default async function handle(args: Args) {
  const { targetCell, sourceCell, commandService } = args;
  const { id: targetId } = targetCell;
  const { group } = targetCell.getData();
  const groupId = group ? group : uuidv4();
  !group &&
    (await commandService.executeCommand<NsGroupCmd.AddGroup.IArgs>(
      XFlowGroupCommands.ADD_GROUP.id,
      {
        nodeConfig: {
          id: groupId,
          isCollapsed: false,
          groupChildren: [targetId],
          renderKey: "GroupCollapsed",
          groupHeaderHeight: 20,
          groupPadding: 40,
          groupCollapsedSize: {
            width: 160,
            height: 40,
          },
          parent: true,
          init: true,
        },
      }
    ));
}
