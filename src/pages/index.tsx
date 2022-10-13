import {
  XFlow,
  FlowchartCanvas,
  CanvasToolbar,
  FlowchartNodePanel,
  FlowchartExtension,
  NodeCollapsePanel,
  DagGraphExtension,
  XFlowCanvas,
  XFlowNodeCommands,
  uuidv4,
  CanvasNodePortTooltip,
} from "@antv/xflow";
import type { NsNodeCmd } from "@antv/xflow";
import * as dndPanelConfig from "./config-dnd-panel";
import { useToolbarConfig } from "./toolbar-config";
import { useGraphConfig } from "./graph-config";
import { useGraphHookConfig } from "./config-graph";
import { useCmdConfig } from "./config-cmd";
import CustomPanel from "./custom";
import "antd/dist/antd.css";
import "@antv/xflow/dist/index.css";
import "./index.less";

export interface IProps {
  meta: { flowId: string };
}

const XFlowView: React.FC<IProps> = (props) => {
  const { meta } = props;
  const toolbarConfig = useToolbarConfig(props);
  const graphConfig = useGraphConfig(props);
  const graphHooksConfig = useGraphHookConfig(props);
  const cmdConfig = useCmdConfig();

  return (
    <XFlow
      className="xflow-workspace"
      meta={meta}
      hookConfig={graphHooksConfig}
      commandConfig={cmdConfig}
      // graphConfig={graphConfig}
    >
      <DagGraphExtension />
      <CustomPanel
        position={{ width: 230, top: 0, bottom: 0, left: 0 }}
        onNodeDrop={dndPanelConfig.onNodeDrop}
      />
      {/* <NodeCollapsePanel
        className="xflow-node-panel"
        nodeDataService={dndPanelConfig.nodeDataService}
        onNodeDrop={dndPanelConfig.onNodeDrop}
        position={{ width: 230, top: 0, bottom: 0, left: 0 }}
        footerPosition={{ height: 0 }}
        bodyPosition={{ top: 40, bottom: 0, left: 0 }}
        header={<div>元件</div>}
      /> */}

      <XFlowCanvas position={{ top: 0, left: 230, right: 290, bottom: 0 }}>
        <CanvasToolbar
          layout="horizontal"
          config={toolbarConfig}
          position={{ top: 0, left: 0, right: 0, height: 40 }}
        />
        <CanvasNodePortTooltip />
      </XFlowCanvas>
    </XFlow>
  );
};

export default XFlowView;

XFlowView.defaultProps = {
  meta: { flowId: "test-meta-flow-id" },
};
