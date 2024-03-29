import React from "react";
import { WorkspacePanel, IWorkspacePanelProps, NsGraph } from "@antv/xflow";
import { Card, Row, Col, Select } from "antd";
import { useGraphDnd, IBodyProps } from "@/components/flow";
import { ProcessNode, ConnectorNode, SquareNode } from "@/components/nodes";
import { ColNode } from "@/components/flow-custom";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import styles from "./index.less";

const CardBody: React.FC<IBodyProps> = (props) => {
  const { onMouseDown } = useGraphDnd(props);
  return (
    <Card size="small" bodyStyle={{ padding: 0 }} headStyle={{ padding: 0 }}>
      <Row className={styles["row"]}>
        <Col span={24}>
          <ColNode
            onMouseDown={onMouseDown}
            nodeConfig={{
              renderKey: "ProcessNode",
              label: "流程元素",
              width: 110,
              height: 50,
              fill: "rgba(90, 120, 200, 0.56)",
              fontFill: "#ebf7ff",
            }}
            size={{
              width: 110,
              height: 50,
            }}
            data={{
              fill: "rgba(90, 120, 200, 0.56)",
              fontFill: "#ebf7ff",
            }}
            node={ProcessNode}
          />
        </Col>
        <Col span={24}>
          <ColNode
            onMouseDown={onMouseDown}
            nodeConfig={{
              renderKey: "ConnectorNode",
              width: 70,
              height: 70,
              label: "判断元素",
              fill: "rgba(90, 120, 200, 0.56)",
              fontFill: "#ebf7ff",
              ports: [
                {
                  type: NsGraph.AnchorType.INPUT,
                  group: NsGraph.AnchorGroup.TOP,
                  tooltip: "输入桩",
                },
              ] as NsGraph.INodeAnchor[],
            }}
            size={{
              width: 70,
              height: 70,
            }}
            data={{
              fill: "rgba(90, 120, 200, 0.56)",
              fontFill: "#ebf7ff",
            }}
            node={ConnectorNode}
          />
        </Col>
        <Col span={24}>
          <ColNode
            onMouseDown={onMouseDown}
            nodeConfig={{
              renderKey: "SquareNode",
              label: "判断元素",
              width: 70,
              height: 70,
              fill: "rgba(90, 120, 200, 0.56)",
              fontFill: "#ebf7ff",
              ports: [
                {
                  type: NsGraph.AnchorType.INPUT,
                  group: NsGraph.AnchorGroup.TOP,
                  tooltip: "输入桩",
                },
              ] as NsGraph.INodeAnchor[],
            }}
            size={{
              width: 70,
              height: 70,
            }}
            data={{
              fill: "rgba(90, 120, 200, 0.56)",
              fontFill: "#ebf7ff",
            }}
            node={SquareNode}
          />
        </Col>
      </Row>
    </Card>
  );
};

const CustomPanel: React.FC<IWorkspacePanelProps> = (props) => {
  return (
    <WorkspacePanel {...props}>
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
        <CardBody onNodeDrop={dndPanelConfig.onNodeDrop} />
      </Card>
    </WorkspacePanel>
  );
};

export default React.memo(CustomPanel);
