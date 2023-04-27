import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import type { NsGraph } from "@antv/xflow";
import { useXFlowApp, XFlowGroupCommands } from "@antv/xflow";

import "./index.less";

export const GroupCollapsed: NsGraph.INodeRender = (props) => {
  const { cell } = props;
  const app = useXFlowApp();
  const isCollapsed = props.data.isCollapsed || false;
  const onExpand = () => {
    app.executeCommand(XFlowGroupCommands.COLLAPSE_GROUP.id, {
      nodeId: cell.id,
      isCollapsed: false,
    });
  };
  const onCollapse = () => {
    app.executeCommand(XFlowGroupCommands.COLLAPSE_GROUP.id, {
      nodeId: cell.id,
      isCollapsed: true,
      gap: 3,
    });
  };

  return (
    <div className="xflow-group-node">
      <div className="xflow-group-header">
        <div className="header-left">{props.data.label}</div>
        <div className="header-right">
          {isCollapsed && <PlusSquareOutlined onClick={onExpand} />}
          {!isCollapsed && <MinusSquareOutlined onClick={onCollapse} />}
        </div>
      </div>
    </div>
  );
};
