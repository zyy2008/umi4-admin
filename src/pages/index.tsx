import {
  XFlow,
  CanvasToolbar,
  DagGraphExtension,
  XFlowCanvas,
  CanvasNodePortTooltip,
  JsonSchemaForm,
  CanvasContextMenu,
} from "@antv/xflow";
import * as dndPanelConfig from "./config-dnd-panel";
import { useToolbarConfig } from "./toolbar-config";
import { useGraphConfig } from "./graph-config";
import { useGraphHookConfig } from "./config-graph";
import { useCmdConfig } from "./config-cmd";
import { useMenuConfig } from "./config-menu";
import { NsJsonForm } from "./form-service";
import { CustomPanel, controlMapService } from "./components";
import { Card } from "antd";
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
        <CustomPanel
          position={{ width: 230, top: 0, bottom: 0, left: 0 }}
          onNodeDrop={dndPanelConfig.onNodeDrop}
        />

        <XFlowCanvas
          position={{ top: 0, left: 230, right: 290, bottom: 0 }}
          config={graphConfig}
        >
          <CanvasToolbar
            layout="horizontal"
            config={toolbarConfig}
            position={{ top: 0, left: 0, right: 0, height: 40 }}
          />
          <CanvasContextMenu config={menuConfig} />
          <CanvasNodePortTooltip />
        </XFlowCanvas>
        <JsonSchemaForm
          controlMapService={controlMapService}
          formSchemaService={NsJsonForm.formSchemaService}
          formValueUpdateService={NsJsonForm.formValueUpdateService}
          position={{ top: 0, bottom: 0, right: 0, width: 290 }}
          footerPosition={{
            height: 0,
          }}
        />
      </XFlow>
    </Card>
  );
};

export default XFlowView;

XFlowView.defaultProps = {
  meta: { flowId: "test-meta-flow-id" },
};
