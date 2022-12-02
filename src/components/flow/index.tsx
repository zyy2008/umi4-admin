import {
  XFlow,
  CanvasToolbar,
  DagGraphExtension,
  XFlowCanvas,
  CanvasNodePortTooltip,
  CanvasContextMenu,
  IToolbarProps,
  createToolbarConfig,
  IPosition,
  IAppLoad,
  NsGraph,
} from "@antv/xflow";
import { useGraphConfig } from "./graph-config";
import { useGraphHookConfig } from "./config-graph";
import { useCmdConfig } from "./config-cmd";
import { useMenuConfig } from "./config-menu";
import { Card, CardProps } from "antd";
import "antd/dist/antd.css";
import "@antv/xflow/dist/index.css";
import "./index.less";

export interface IProps {
  meta?: { flowId: string };
  toolbarProps?: Partial<IToolbarProps>;
  cardProps?: CardProps;
  position?: IPosition;
  connectionType?: "one-to-one" | "one-to-many";
  onLoad?: IAppLoad;
  events?: NsGraph.IEvent[];
}

const toolbarConfig = createToolbarConfig(() => {});

const XFlowView: React.FC<IProps> = (props) => {
  const { meta, toolbarProps, cardProps, position, connectionType, onLoad } =
    props;
  const config = toolbarConfig();
  const graphConfig = useGraphConfig(props);
  const graphHooksConfig = useGraphHookConfig(props);
  const cmdConfig = useCmdConfig({ connectionType });
  const menuConfig = useMenuConfig();

  return (
    <Card
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
      {...cardProps}
    >
      <XFlow
        className="xflow-workspace"
        meta={meta}
        hookConfig={graphHooksConfig}
        commandConfig={cmdConfig}
        onLoad={onLoad}
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
          position={{ top: 0, left: 260, right: 290, bottom: 0, ...position }}
          config={graphConfig}
        >
          {toolbarProps && (
            <CanvasToolbar
              layout="horizontal"
              config={config}
              position={{ top: 0, left: 0, right: 0, height: 40 }}
              {...toolbarProps}
            />
          )}

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

export * from "./dnd-hook";
export type { IPanelNode, IOnNodeDrop } from "./interface";
