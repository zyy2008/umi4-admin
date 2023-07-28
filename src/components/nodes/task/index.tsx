import React from "react";
import { SettingOutlined } from "@ant-design/icons";
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
    stroke = DefaultNodeConfig.stroke,
    label = DefaultNodeConfig.label,
    fill = DefaultNodeConfig.fill,
    fontFill = DefaultNodeConfig.fontFill,
    fontSize = DefaultNodeConfig.fontSize,
  } = data;
  const { width, height } = size;
  return (
    <div className={styles["task"]} style={{ width, height, fontSize }}>
      <span className="icon">
        <SettingOutlined />
      </span>
      <span className="label">{label}</span>
    </div>
  );
};
