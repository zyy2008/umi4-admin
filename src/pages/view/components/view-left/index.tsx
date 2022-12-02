import React from "react";
import type { IAppLoad, NsGraphCmd } from "@antv/xflow";
import {
  XFlow,
  createGraphConfig,
  XFlowCanvas,
  XFlowGraphCommands,
} from "@antv/xflow";
import ViewFlow from "@/components/flow";
import { getGraphData } from "./mock";
// import "@antv/xflow/dist/index.css";
// import "./index.less";

/**  graphConfig：配置Graph  */
export const useGraphConfig = createGraphConfig<{}>((graphConfig) => {
  graphConfig.setDefaultNodeRender((props) => {
    return <div className="react-node"> {props.data.label} </div>;
  });
});

const ViewLeft: React.FC<{}> = (props) => {
  const graphConfig = useGraphConfig(props);

  const onLoad: IAppLoad = async (app) => {
    // 计算布局
    const res = await app.executeCommand<
      NsGraphCmd.GraphLayout.IArgs,
      NsGraphCmd.GraphLayout.IResult
    >(XFlowGraphCommands.GRAPH_LAYOUT.id, {
      layoutType: "dagre",
      layoutOptions: {
        type: "dagre",
        /** 布局方向 */
        rankdir: "TB",
        /** 节点间距 */
        nodesep: 60,
        /** 层间距 */
        ranksep: 30,
      },
      graphData: getGraphData(),
    });
    const { graphData } = res.contextProvider().getResult();
    // render
    await app.executeCommand<NsGraphCmd.GraphRender.IArgs>(
      XFlowGraphCommands.GRAPH_RENDER.id,
      {
        graphData: graphData,
      }
    );
    // 居中
    await app.executeCommand<NsGraphCmd.GraphZoom.IArgs>(
      XFlowGraphCommands.GRAPH_ZOOM.id,
      {
        factor: "fit",
      }
    );
  };

  return <ViewFlow />;
};

export default ViewLeft;
