import React from "react";
import {
  DatabaseOutlined,
  RedoOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import type { NsGraph } from "@antv/xflow";
import { NsGraphStatusCommand } from "@antv/xflow";
import "./index.less";

const fontStyle = { fontSize: "16px", color: "#3057e3" };

export const TaskNode: NsGraph.INodeRender = (props) => {
  console.log(props);
  return (
    <div
      className={`xflow-algo-node ${props.isNodeTreePanel ? "panel-node" : ""}`}
    >
      <span className="icon">
        <DatabaseOutlined style={fontStyle} />
      </span>
      <span className="label">{props.data.label}</span>
    </div>
  );
};
