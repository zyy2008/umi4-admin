import React from "react";
import type { NsGraphCmd, NsGraph, IApplication } from "@antv/xflow";
import { XFlowGraphCommands } from "@antv/xflow";

type IProps = {
  graphData?: NsGraph.IGraphData;
  app?: IApplication;
};

export const useReader = (props: IProps) => {
  const { graphData, app } = props;
  React.useEffect(() => {
    if (app && graphData) {
      (async () => {
        const graph = await app.getGraphInstance();
        const config = await app.getGraphConfig();
        graph.clearCells();
        await app.executeCommand<
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
          graphData,
        });
        const format = graphData?.nodes?.map((item) => ({
          ...item,
          view: config.graphId,
        }));
        await app.executeCommand(XFlowGraphCommands.GRAPH_RENDER.id, {
          graphData: {
            ...graphData,
            nodes: format,
          },
        } as NsGraphCmd.GraphRender.IArgs);
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
};
