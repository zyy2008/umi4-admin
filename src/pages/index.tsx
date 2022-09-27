import {
  XFlow,
  FlowchartCanvas,
  CanvasToolbar,
  FlowchartNodePanel,
  FlowchartExtension,
} from "@antv/xflow";
import { useToolbarConfig } from "./toolbar-config";
import "antd/dist/antd.css";
import "@antv/xflow/dist/index.css";
import "./index.less";

/**  Demo Props  */
export interface IDemoProps {
  anything: string;
}

const XFlowDemo: React.FC<{}> = (props) => {
  const toolbarConfig = useToolbarConfig(props);
  return (
    <XFlow className="xflow-workspace">
      <FlowchartExtension />
      <FlowchartNodePanel
        position={{ width: 162, top: 40, bottom: 0, left: 0 }}
      />
      <FlowchartCanvas position={{ top: 0, bottom: 0, left: 0, right: 0 }}>
        <CanvasToolbar
          layout="horizontal"
          config={toolbarConfig}
          position={{ top: 0, left: 0, right: 0, height: 40 }}
        />
        {/* <CanvasMiniMap position={{ bottom: 12, left: 12 }} /> */}
      </FlowchartCanvas>
    </XFlow>
  );
};

export default XFlowDemo;
