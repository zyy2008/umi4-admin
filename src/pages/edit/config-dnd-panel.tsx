import { uuidv4 } from "@antv/xflow";
import { XFlowNodeCommands } from "@antv/xflow";
import type { NsNodeCmd } from "@antv/xflow";
import type { NsNodeCollapsePanel } from "@antv/xflow";

export const onNodeDrop: NsNodeCollapsePanel.IOnNodeDrop = async (
  node,
  commands,
  modelService
) => {
  const args: NsNodeCmd.AddNode.IArgs = {
    nodeConfig: { ...node, id: uuidv4() },
  };
  commands.executeCommand(XFlowNodeCommands.ADD_NODE.id, args);
};
