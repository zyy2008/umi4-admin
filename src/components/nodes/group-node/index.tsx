import React from "react";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import type { NsGraph } from "@antv/xflow";
import { useXFlowApp, XFlowGroupCommands } from "@antv/xflow";

import "./index.less";

export const GroupNode: NsGraph.INodeRender = (props) => {
  return (
    <div className="xflow-group-node">
      <div className="xflow-group-header">
        <div className="header-left">{props.data.label}</div>
      </div>
    </div>
  );
};
