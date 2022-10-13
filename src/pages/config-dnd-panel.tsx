import { uuidv4, NsCollapsePanelModel, randomInt } from "@antv/xflow";
import { XFlowNodeCommands } from "@antv/xflow";
import {
  // utils
  Disposable,
  // context
  useXFlowApp,
  // models
  MODELS,
  createComponentModel,
  // commands
  XFlowModelCommands,
} from "@antv/xflow-core";
import { DND_RENDER_ID } from "./constants";
import type { NsNodeCmd } from "@antv/xflow";
import type { NsNodeCollapsePanel } from "@antv/xflow";
import { Input, Row, Col } from "antd";
import React from "react";

const { Search } = Input;

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

const NodeDescription: React.FC<{ name?: string; modelService: any }> = (
  props
) => {
  const app = useXFlowApp();
  return (
    <Row>
      <Col span={6}>
        <h4>{props?.name}</h4>
      </Col>
      <Col span={18}>
        <Search onSearch={(v) => {}} />
      </Col>
    </Row>
  );
};

export const nodeDataService: NsNodeCollapsePanel.INodeDataService = async (
  meta,
  modelService
) => {
  console.log(meta, modelService);
  return [
    {
      id: "参数",
      header: (
        <NodeDescription name="参数" modelService={modelService} />
      ) as any,
      isCollapsed: false,
      collapsible: false,
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
        {
          id: uuidv4(),
          label: "算法组件2",
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
