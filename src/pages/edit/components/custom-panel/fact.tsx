import React from "react";
import { uuidv4 } from "@antv/xflow";
import type { IConfigRenderOptions } from "@/components/flow";
import { CardList } from "./index";

const Fact: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  return (
    <CardList
      title="事实"
      dataSource={[
        {
          id: uuidv4(),
          label: "事实组件2",
          renderKey: "RectNode",
          width: 110,
          height: 50,
        },
      ]}
      onMouseDown={onMouseDown}
    />
  );
};

export default Fact;
