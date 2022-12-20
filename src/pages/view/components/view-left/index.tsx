import React from "react";
import ViewFlow from "@/components/flow";
import type { NsGraph, IAppLoad, NsGraphCmd, IApplication } from "@antv/xflow";
import { XFlowGraphCommands } from "@antv/xflow";

type IProps = {
  graphData?: NsGraph.IGraphData;
};

const ViewLeft: React.FC<IProps> = (props) => {
  const { graphData } = props;
  const [app, setApp] = React.useState<IApplication>();
  const onLoad: IAppLoad = async (app) => {
    const graph = await app.getGraphInstance();
    graph.off("node:mouseenter");
    setApp(app);
  };
  React.useEffect(() => {
    if (app && graphData) {
      (async () => {
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
          graphData: graphData,
        });
        const { graphData: data } = res.contextProvider().getResult();
        // render
        await app.executeCommand<NsGraphCmd.GraphRender.IArgs>(
          XFlowGraphCommands.GRAPH_RENDER.id,
          {
            graphData: data,
          }
        );
        // 居中
        await app.executeCommand<NsGraphCmd.GraphZoom.IArgs>(
          XFlowGraphCommands.GRAPH_ZOOM.id,
          {
            factor: "real",
          }
        );
      })();
    }
  }, [app, graphData]);
  return (
    <ViewFlow
      position={{ left: 0, right: 0 }}
      nodeMovable={false}
      onLoad={onLoad}
      contextMenu={false}
    />
  );
};

export default ViewLeft;
