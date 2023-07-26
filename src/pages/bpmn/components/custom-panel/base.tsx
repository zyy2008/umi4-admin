import { NsGraph } from "@antv/xflow-core";
import { Card, Row } from "antd";
import { IConfigRenderOptions } from "@/components/flow";
import {
  DecisionNode,
  DataIONode,
  SectorNode,
  ManualOperationNode,
  TaskNode,
  RectNode,
} from "@/components/nodes";
import { ColNode } from "@/components/flow-custom";

const ports: NsGraph.INodeAnchor[] = [
  {
    group: NsGraph.AnchorGroup.BOTTOM,
    id: "",
  },
  {
    group: NsGraph.AnchorGroup.LEFT,
    id: "",
  },
  {
    group: NsGraph.AnchorGroup.RIGHT,
    id: "",
  },
  {
    group: NsGraph.AnchorGroup.TOP,
    id: "",
  },
];

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
            ports,
          }}
        />
        <ColNode
          onMouseDown={onMouseDown}
          node={DataIONode}
          nodeConfig={{
            label: "网关",
            renderKey: "DataIONode",
            ports,
          }}
        />
        <ColNode
          onMouseDown={onMouseDown}
          node={RectNode}
          size={{
            width: 90,
            height: 40,
          }}
          nodeConfig={{
            label: "用户任务",
            renderKey: "RectNode",
            ports,
          }}
        />
        <ColNode
          onMouseDown={onMouseDown}
          node={RectNode}
          size={{
            width: 90,
            height: 40,
          }}
          nodeConfig={{
            label: "系统任务",
            renderKey: "RectNode",
            ports,
          }}
        />
      </Row>
    </Card>
  );
};

export default Base;
