import type { NsGraph } from "@antv/xflow-core";
import {
  NODE_HEIGHT,
  NODE_WIDTH,
  DefaultNodeConfig,
} from "@/components/flow/constants";
import styles from "./index.less";

export const EndNode: NsGraph.INodeRender = (props) => {
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
    <div className={styles["round"]} style={{ width, height, fontSize }}>
      <span>{label}</span>
    </div>
  );
};
