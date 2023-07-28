import { NsGraph } from "@antv/xflow-core";
import { Card, Row } from "antd";
import { IConfigRenderOptions } from "@/components/flow";
import { TaskNode, EndNode, ConditionNode } from "@/components/nodes";
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
          node={ConditionNode}
          size={{
            width: 40,
            height: 40,
          }}
          nodeConfig={{
            renderKey: "ConditionNode",
            ports,
            width: 50,
            height: 50,
            fontSize: 20,
            XfontSize: 30,
          }}
        />
        <ColNode
          onMouseDown={onMouseDown}
          node={TaskNode}
          size={{
            width: 90,
            height: 40,
          }}
          data={{
            fontSize: 12,
          }}
          nodeConfig={{
            label: "服务任务",
            renderKey: "TaskNode",
            ports,
            width: 100,
            height: 70,
          }}
        />
        <ColNode
          onMouseDown={onMouseDown}
          node={EndNode}
          size={{
            width: 40,
            height: 40,
          }}
          data={{
            fontSize: 12,
          }}
          nodeConfig={{
            label: "结束",
            renderKey: "EndNode",
            ports: ports.map((item) => ({
              ...item,
              type: NsGraph.AnchorType.INPUT,
            })),
            width: 50,
            height: 50,
          }}
        />
      </Row>
    </Card>
  );
};

export default Base;
