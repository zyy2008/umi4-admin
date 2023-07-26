import React from "react";
import { Graph } from "@antv/g6";
import { NsGraph } from "@antv/xflow";
import styles from "./index.less";
import { formatTree } from "./uilts";
import G6 from "./register";
import { appenAutoShapeListener } from "./event";
import Drawer from "./drawer";
import DataState from "./data-state";

type IProps = {
  viewData: NsGraph.IGraphData;
};

const G6View: React.FC<IProps> = ({ viewData }) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [graph, setGraph] = React.useState<Graph>();
  const [dataState, setDataState] = React.useState<DataState>();
  React.useEffect(() => {
    if (divRef.current) {
      // 初始化画布
      const grid = new G6.Grid();
      const graph = new G6.TreeGraph({
        container: divRef.current,
        plugins: [grid],
        fitCenter: true,
        fitView: true,
        modes: {
          default: ["drag-canvas", "zoom-canvas"],
        },
        defaultEdge: {
          type: "polyline",
          style: {
            stroke: "rgba(134, 212, 255, 1)",
          },
        },
        defaultNode: {
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        layout: {
          type: "compactBox",
          direction: "TB",
          getId({ id }: any) {
            return id;
          },

          getVGap() {
            return 30;
          },

          getHGap() {
            return 40;
          },
        },
      });
      setGraph(graph);
      appenAutoShapeListener(graph);
    }
    return () => {
      graph?.destroy();
    };
  }, [divRef]);
  React.useEffect(() => {
    if (graph && viewData) {
      const res = formatTree(viewData);
      graph.data(res);
      graph.render();
    }
  }, [graph, viewData]);

  //模拟告警

  React.useEffect(() => {
    if (graph) {
      const dataState = new DataState([], graph);
      setDataState(dataState);
    }
  }, [graph]);

  return (
    <React.Fragment>
      <Drawer graph={graph} />
      <div ref={divRef} className={styles["g6-view"]} />
    </React.Fragment>
  );
};

export default G6View;
