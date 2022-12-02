import React from "react";
import ViewFlow from "@/components/flow";
import type { NsGraph } from "@antv/xflow";

type IProps = {
  graphData?: NsGraph.IGraphData;
};

const ViewLeft: React.FC<IProps> = (props) => {
  const { graphData } = props;
  return (
    <ViewFlow
      position={{ left: 0, right: 0 }}
      graphData={graphData}
      nodeMovable={false}
    />
  );
};

export default ViewLeft;
