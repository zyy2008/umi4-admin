import React from "react";
import ViewFlow from "@/components/flow";
import type { NsGraph, IAppLoad, IApplication } from "@antv/xflow";
import { CanvasScaleToolbar } from "@antv/xflow";
import { useReader } from "../hooks";

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
  useReader({ app, graphData });
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
};

export default ViewLeft;
