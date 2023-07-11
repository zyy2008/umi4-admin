import React from "react";
import ViewFlow from "@/components/flow";
import type { NsGraph, IAppLoad, IApplication } from "@antv/xflow";
import { CanvasScaleToolbar } from "@antv/xflow";
import { graphinReader } from "@/utils";
import { Graph } from "@antv/x6";
import Graphin, { Utils, Behaviors } from "@antv/graphin";
import { Grid } from "@antv/graphin-components";

type IProps = {
  graphData?: NsGraph.IGraphData;
};

export type ViewHandle = {
  app?: Graphin;
};

const data = Utils.mock(10).circle().graphin();

const ViewLeft = React.forwardRef<ViewHandle, IProps>((props, ref) => {
  const { graphData } = props;
  const [app, setApp] = React.useState<Graphin>();
  const graphinRef = React.useRef<Graphin>(null);
  React.useEffect(() => {
    if (graphinRef.current) {
      setApp(graphinRef.current);
    }
  }, [graphinRef.current]);
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
    <Graphin data={data} ref={graphinRef} graphDOM={<div></div>}></Graphin>
  );
});

export default React.memo(ViewLeft);
