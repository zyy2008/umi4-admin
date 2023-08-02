import React from "react";
import {
  SettingOutlined,
  ApartmentOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import type { NsGraph } from "@antv/xflow";
import styles from "./index.less";
import {
  NODE_HEIGHT,
  NODE_WIDTH,
  DefaultNodeConfig,
} from "@/components/flow/constants";

// const fontStyle = { fontSize: "16px" };

export const TaskNode: NsGraph.INodeRender = (props) => {
  const { size = { width: NODE_WIDTH, height: NODE_HEIGHT }, data = {} } =
    props;
  const {
    label = DefaultNodeConfig.label,
    fontSize = DefaultNodeConfig.fontSize,
    icon = <SettingOutlined />,
  } = data;
  const { width, height } = size;
  return (
    <div className={styles["task"]} style={{ width, height, fontSize }}>
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
    </div>
  );
};

export const ToolNode: NsGraph.INodeRender = (props) => {
  return (
    <TaskNode
      {...props}
      data={{
        ...props.data,
        icon: <ToolOutlined />,
      }}
    />
  );
};

export const EventNode: NsGraph.INodeRender = (props) => {
  return (
    <TaskNode
      {...props}
      data={{
        ...props.data,
        icon: <ApartmentOutlined />,
      }}
    />
  );
};
