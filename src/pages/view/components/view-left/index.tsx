import React from "react";
import ViewFlow from "@/components/flow";
import type { NsGraph, IAppLoad, IApplication } from "@antv/xflow";
import { CanvasScaleToolbar } from "@antv/xflow";
import { graphReader } from "@/utils";
import { Graph } from "@antv/x6";

type IProps = {
  graphData?: NsGraph.IGraphData;
};

type ViewHandle = {
  app?: IApplication;
};

const ViewLeft = React.forwardRef<ViewHandle, IProps>((props, ref) => {
  const { graphData } = props;
  const [app, setApp] = React.useState<IApplication>();
  const [graph, setGraph] = React.useState<Graph>();
  const onLoad: IAppLoad = async (app) => {
    const graph = await app.getGraphInstance();
    graph.off("node:mouseenter");
    setApp(app);
    setGraph(graph);
  };
  React.useImperativeHandle(
    ref,
    () => {
      return {
        app: app,
      };
    },
    [app]
  );

  React.useEffect(() => {
    if (graphData && app) {
      graphReader(graphData, app);
    }
    return () => {
      console.log(graph);
      if (graph) {
        graph.clearCells();
      }
    };
  }, [graphData, app, graph]);
  return (
    <ViewFlow
      position={{ left: 0, right: 0 }}
      nodeMovable={false}
      onLoad={onLoad}
      contextMenu={false}
    >
      <CanvasScaleToolbar position={{ top: 12, left: 12 }} />
    </ViewFlow>
  );
});

export default React.memo(ViewLeft);
