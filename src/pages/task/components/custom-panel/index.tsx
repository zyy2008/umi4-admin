import React from "react";
import { WorkspacePanel, IWorkspacePanelProps } from "@antv/xflow";
import { NsGraph } from "@antv/xflow-core";
import { Card, Row } from "antd";
import {
  useGraphDnd,
  IOnNodeDrop,
  IConfigRenderOptions,
} from "@/components/flow";
import { DecisionNode } from "@/components/nodes";
import { ColNode } from "@/components/flow-custom";
import TaskList from "./task-list";
import AlgorithmList from "./algorithm-list";

const BaseNodes: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  return (
    <Row>
      <ColNode
        onMouseDown={onMouseDown}
        node={DecisionNode}
        nodeConfig={{
          label: "if",
          renderKey: "DecisionNode",
          nodeType: "BRANCH",
          ports: [
            {
              type: NsGraph.AnchorType.OUTPUT,
              group: NsGraph.AnchorGroup.LEFT,
              tooltip: "输出桩",
            },
            {
              type: NsGraph.AnchorType.OUTPUT,
              group: NsGraph.AnchorGroup.RIGHT,
              tooltip: "输出桩",
            },
            {
              type: NsGraph.AnchorType.INPUT,
              group: NsGraph.AnchorGroup.TOP,
              tooltip: "输入桩",
            },
          ] as NsGraph.INodeAnchor[],
        }}
      />
    </Row>
  );
};

const CardBody: React.FC<{ onNodeDrop: IOnNodeDrop }> = (props) => {
  const { onMouseDown } = useGraphDnd(props);
  return (
    <>
      <TaskList onMouseDown={onMouseDown} />
      <AlgorithmList onMouseDown={onMouseDown} />
      <Card title="条件类型" size="small">
        <BaseNodes onMouseDown={onMouseDown} />
      </Card>
    </>
  );
};

const CustomPanel: React.FC<
  IWorkspacePanelProps & {
    onNodeDrop: IOnNodeDrop;
  }
> = (props) => {
  const { onNodeDrop, ...other } = props;
  return (
    <WorkspacePanel {...other}>
      <Card
        title="任务区"
        size="small"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
        bodyStyle={{
          padding: 0,
          flex: 1,
          overflow: "auto",
        }}
      >
        <CardBody onNodeDrop={onNodeDrop} />
      </Card>
    </WorkspacePanel>
  );
};

export default CustomPanel;
