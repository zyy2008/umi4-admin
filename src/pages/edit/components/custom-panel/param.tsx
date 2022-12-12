import React from "react";
import { uuidv4 } from "@antv/xflow";
import { NsGraph } from "@antv/xflow-core";
import type { IConfigRenderOptions } from "@/components/flow";
import { CardList } from "./index";

const Param: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  return (
    <CardList
      title="参数"
      dataSource={[
        {
          id: uuidv4(),
          label: "算法组件1",
          renderKey: "ConnectorNode",
          width: 70,
          height: 70,
          ports: [
            {
              type: NsGraph.AnchorType.OUTPUT,
              group: NsGraph.AnchorGroup.BOTTOM,
              tooltip: "输出桩",
            },
          ] as NsGraph.INodeAnchor[],
        },
      ]}
      onMouseDown={onMouseDown}
    />
  );
};

export default Param;
