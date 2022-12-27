import React from "react";
import ViewFlow from "@/components/flow";
import type { NsGraph, IAppLoad, IApplication } from "@antv/xflow";
import { CanvasScaleToolbar } from "@antv/xflow";

type IProps = {
  graphData?: NsGraph.IGraphData;
};

type ViewHandle = {
  app?: IApplication;
};

const ViewLeft = React.forwardRef<ViewHandle, IProps>((props, ref) => {
  const { graphData } = props;
  const [app, setApp] = React.useState<IApplication>();
  const onLoad: IAppLoad = async (app) => {
    const graph = await app.getGraphInstance();
    graph.off("node:mouseenter");
    setApp(app);
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
  return (
    <ViewFlow
      position={{ left: 0, right: 0 }}
      nodeMovable={false}
      onLoad={onLoad}
      contextMenu={false}
      graphData={graphData}
    >
      <CanvasScaleToolbar position={{ top: 12, left: 12 }} />
    </ViewFlow>
  );
});

export default React.memo(ViewLeft);
