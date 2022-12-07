import React from "react";
import ViewFlow from "@/components/flow";
import type { NsGraph, IAppLoad } from "@antv/xflow";

type IProps = {
  graphData?: NsGraph.IGraphData;
};

const ViewLeft: React.FC<IProps> = (props) => {
  const { graphData } = props;
  const onLoad: IAppLoad = async (app) => {
    const graph = await app.getGraphInstance();
    graph.off("node:mouseenter");
  };
  return (
    <ViewFlow
      position={{ left: 0, right: 0 }}
      graphData={graphData}
      nodeMovable={false}
      onLoad={onLoad}
      contextMenu={false}
    />
  );
};

export default ViewLeft;
