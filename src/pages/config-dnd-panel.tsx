import { uuidv4 } from "@antv/xflow";
import { XFlowNodeCommands } from "@antv/xflow";
import { DND_RENDER_ID } from "./constants";
import type { NsNodeCmd } from "@antv/xflow";
import type { NsNodeCollapsePanel } from "@antv/xflow";
import { Card } from "antd";

export const onNodeDrop: NsNodeCollapsePanel.IOnNodeDrop = async (
  node,
  commands,
  modelService
) => {
  console.log("123");
  const args: NsNodeCmd.AddNode.IArgs = {
    nodeConfig: { ...node, id: uuidv4() },
  };
  commands.executeCommand(XFlowNodeCommands.ADD_NODE.id, args);
};

const NodeDescription = (props: { name: string }) => {
  return (
    <Card
      size="small"
      title="算法组件介绍"
      style={{ width: "200px" }}
      bordered={false}
    >
      欢迎使用：{props.name}
      这里可以根据服务端返回的数据显示不同的内容
    </Card>
  );
};

export const nodeDataService: NsNodeCollapsePanel.INodeDataService = async (
  meta,
  modelService
) => {
  console.log(meta, modelService);
  return [
    {
      id: "数据读写",
      header: "数据读写",
      children: [
        {
          id: uuidv4(),
          label: "算法组件1",
          // parentId: "1",
          renderKey: DND_RENDER_ID,
          renderComponent: (props) => (
            <div className="react-dnd-node react-custom-node-1">
              {props.data.label}
            </div>
          ),
        },
      ],
    },
  ];
};
