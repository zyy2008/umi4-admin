import {
  XFlow,
  CanvasToolbar,
  DagGraphExtension,
  XFlowCanvas,
  CanvasNodePortTooltip,
  CanvasContextMenu,
  IToolbarProps,
  createToolbarConfig,
} from "@antv/xflow";
import { useGraphConfig } from "./graph-config";
import { useGraphHookConfig } from "./config-graph";
import { useCmdConfig } from "./config-cmd";
import { useMenuConfig } from "./config-menu";
import { Card } from "antd";
import "antd/dist/antd.css";
import "@antv/xflow/dist/index.css";
import "./index.less";

export interface IProps {
  meta?: { flowId: string };
  toolbarProps?: Partial<IToolbarProps>;
}

const toolbarConfig = createToolbarConfig(() => {});

const XFlowView: React.FC<IProps> = (props) => {
  const { meta, toolbarProps } = props;
  const config = toolbarConfig();
  const graphConfig = useGraphConfig(props);
  const graphHooksConfig = useGraphHookConfig(props);
  const cmdConfig = useCmdConfig();
  const menuConfig = useMenuConfig();

  return (
    <Card
      title="知识编辑器"
      bodyStyle={{
        padding: 0,
        paddingTop: 1,
        flex: 1,
        position: "relative",
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      size="small"
    >
      <XFlow
        className="xflow-workspace"
        meta={meta}
        hookConfig={graphHooksConfig}
        commandConfig={cmdConfig}
      >
        <DagGraphExtension
          router={{
            name: "manhattan",
          }}
          connector={{
            name: "rounded",
          }}
        />
        {props?.children}
        <XFlowCanvas
          position={{ top: 0, left: 260, right: 290, bottom: 0 }}
          config={graphConfig}
        >
          <CanvasToolbar
            layout="horizontal"
            config={config}
            position={{ top: 0, left: 0, right: 0, height: 40 }}
            {...toolbarProps}
          />
          <CanvasContextMenu config={menuConfig} />
          <CanvasNodePortTooltip />
        </XFlowCanvas>
      </XFlow>
    </Card>
  );
};

export default XFlowView;

XFlowView.defaultProps = {
  meta: { flowId: "test-meta-flow-id" },
};
