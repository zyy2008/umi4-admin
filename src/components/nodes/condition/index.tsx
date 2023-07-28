import type { NsGraph } from "@antv/xflow-core";
import {
  NODE_HEIGHT,
  NODE_WIDTH,
  DefaultNodeConfig,
} from "@/components/flow/constants";
import styles from "./index.less";

export const ConditionNode: NsGraph.INodeRender = (props) => {
  const { size = { width: NODE_WIDTH, height: NODE_HEIGHT }, data = {} } =
    props;
  const {
    stroke = DefaultNodeConfig.stroke,
    label = DefaultNodeConfig.label,
    fill = DefaultNodeConfig.fill,
    fontFill = DefaultNodeConfig.fontFill,
    fontSize = DefaultNodeConfig.fontSize,
    XfontSize = 20,
  } = data;
  const { width, height } = size;

  return (
    <div className={styles["condition"]}>
      <div className="view" style={{ width, height, fontSize }}>
        <div className="diamond">
          <div
            className="x"
            style={{
              fontSize: XfontSize,
            }}
          >
            X
          </div>
        </div>
      </div>
      <div className="text">{label}</div>
    </div>
  );
};
