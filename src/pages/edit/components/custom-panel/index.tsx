import React from "react";
import { WorkspacePanel, IWorkspacePanelProps } from "@antv/xflow";
import { NsGraph } from "@antv/xflow-core";
import { Card, Row } from "antd";
import {
  useGraphDnd,
  IOnNodeDrop,
  IBodyProps,
  IConfigRenderOptions,
} from "@/components/flow";
import {
  DecisionNode,
  DataIONode,
  SectorNode,
  PreparationNode,
  ManualOperationNode,
} from "@/components/nodes";
import Param from "./param";
import Fact from "./fact";
import Public from "./public";
import { ColNode } from "@/components/flow-custom";

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
      <ColNode
        onMouseDown={onMouseDown}
        node={DataIONode}
        nodeConfig={{
          label: "for",
          renderKey: "DataIONode",
        }}
      />
      <ColNode
        onMouseDown={onMouseDown}
        node={SectorNode}
        size={{
          width: 110,
          height: 55,
        }}
        nodeConfig={{
          label: "switch",
          renderKey: "SectorNode",
          ports: [
            {
              type: NsGraph.AnchorType.INPUT,
              group: NsGraph.AnchorGroup.TOP,
              tooltip: "输入桩",
            },
          ] as NsGraph.INodeAnchor[],
        }}
      />
      <ColNode
        onMouseDown={onMouseDown}
        node={ManualOperationNode}
        size={{
          width: 100,
          height: 50,
        }}
        nodeConfig={{
          label: "while",
          renderKey: "ManualOperationNode",
          ports: [
            {
              type: NsGraph.AnchorType.OUTPUT,
              group: NsGraph.AnchorGroup.BOTTOM,
              tooltip: "输出桩:true",
            },
            {
              type: NsGraph.AnchorType.OUTPUT,
              group: NsGraph.AnchorGroup.LEFT,
              tooltip: "输出桩:false",
              args: {
                dx: 16,
              },
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

const CardBody: React.FC<IBodyProps> = (props) => {
  const { onMouseDown } = useGraphDnd(props);
  return (
    <>
      <Param onMouseDown={onMouseDown} />
      <Fact onMouseDown={onMouseDown} />
      <Card title="条件类型" size="small">
        <BaseNodes onMouseDown={onMouseDown} />
      </Card>
      <Card title="自定义" size="small">
        <Row>
          <ColNode
            onMouseDown={onMouseDown}
            nodeConfig={{
              renderKey: "PreparationNode",
              label: "中间事件",
            }}
            node={PreparationNode}
          />
        </Row>
      </Card>
      <Public onMouseDown={onMouseDown} />
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
        title="元件"
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
