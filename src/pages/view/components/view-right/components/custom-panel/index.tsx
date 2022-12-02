import React from "react";
import { WorkspacePanel, IWorkspacePanelProps, uuidv4 } from "@antv/xflow";
import { NsGraph, IGraphConfig } from "@antv/xflow-core";
import { Card, Row, Col } from "antd";
import { useGraphDnd, IOnNodeDrop } from "@/components/flow";
import { ConnectorNode } from "@/components/nodes";
import style from "./index.less";

interface IConfigRenderOptions {
  graphConfig?: IGraphConfig;
  onMouseDown: (
    nodeConfig: NsGraph.INodeConfig
  ) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const ColNode: React.FC<
  IConfigRenderOptions & {
    node: NsGraph.INodeRender;
    nodeConfig: Omit<NsGraph.INodeConfig, "id">;
    size?: NsGraph.IReactNodeProps["size"];
  }
> = ({ onMouseDown, node, nodeConfig, size }) => {
  const { label, fill } = nodeConfig;
  return (
    <Col span={24}>
      <div
        className={style["col-node"]}
        onMouseDown={onMouseDown({
          width: 70,
          height: 70,
          ...nodeConfig,
          id: uuidv4(),
          fontSize: 15,
        })}
      >
        {React.createElement(node, {
          size: {
            width: 70,
            height: 70,
            ...size,
          },
          data: { label, fill, fontSize: 12 },
          position: {
            x: 0,
            y: 0,
          },
        })}
      </div>
    </Col>
  );
};

const CardBody: React.FC<{ onNodeDrop: IOnNodeDrop }> = (props) => {
  const { onMouseDown } = useGraphDnd(props);
  return (
    <Row>
      <ColNode
        onMouseDown={onMouseDown}
        nodeConfig={{
          renderKey: "ConnectorNode",
          label: "卫星",
          fill: "#87e8de",
          ports: [
            {
              type: NsGraph.AnchorType.OUTPUT,
              group: NsGraph.AnchorGroup.BOTTOM,
              tooltip: "输出桩",
            },
          ] as NsGraph.INodeAnchor[],
        }}
        node={ConnectorNode}
      />
      <ColNode
        onMouseDown={onMouseDown}
        nodeConfig={{
          renderKey: "ConnectorNode",
          label: "分系统",
          fill: "#91caff",
        }}
        node={ConnectorNode}
      />
      <ColNode
        onMouseDown={onMouseDown}
        nodeConfig={{
          renderKey: "ConnectorNode",
          label: "器部件",
          fill: "#ffe58f",
        }}
        node={ConnectorNode}
      />
      <ColNode
        onMouseDown={onMouseDown}
        nodeConfig={{
          renderKey: "ConnectorNode",
          label: "参数",
          fill: "#b7eb8f",
          ports: [
            {
              type: NsGraph.AnchorType.INPUT,
              group: NsGraph.AnchorGroup.TOP,
              tooltip: "输入桩",
            },
          ] as NsGraph.INodeAnchor[],
        }}
        node={ConnectorNode}
      />
    </Row>
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
