import { WorkspacePanel, IWorkspacePanelProps } from "@antv/xflow";
import { NsGraph } from "@antv/xflow-core";
import { Card, Row } from "antd";
import { IConfigRenderOptions } from "@/components/flow";
import {
  DecisionNode,
  DataIONode,
  SectorNode,
  ManualOperationNode,
} from "@/components/nodes";
import { ColNode } from "@/components/flow-custom";

const Base: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  return (
    <Card title="基本工具" size="small">
      <Row>
        <ColNode
          onMouseDown={onMouseDown}
          node={DecisionNode}
          nodeConfig={{
            label: "条件",
            renderKey: "DecisionNode",
            ports: [
              {
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.BOTTOM,
                tooltip: "输出桩",
              },
              {
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.LEFT,
                tooltip: "输出桩:true",
              },
              {
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.RIGHT,
                tooltip: "输出桩:false",
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
            label: "网关",
            renderKey: "DataIONode",
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
        <ColNode
          onMouseDown={onMouseDown}
          node={SectorNode}
          size={{
            width: 110,
            height: 55,
          }}
          nodeConfig={{
            label: "事件3",
            renderKey: "SectorNode",
            ports: [
              {
                type: NsGraph.AnchorType.INPUT,
                group: NsGraph.AnchorGroup.TOP,
                tooltip: "输入桩",
              },
              {
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.LEFT,
                tooltip: "输出桩:false",
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
            label: "事件4",
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
    </Card>
  );
};

export default Base;
