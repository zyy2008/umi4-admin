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
      if (res) {
        graph.data(res);
        graph.render();
      }
    }
  }, [graph, viewData]);

  //模拟告警

  React.useEffect(() => {
    if (graph && viewData) {
      const mock1 = [
        {
          id: "5cf107d3-ef9c-4073-bcc4-c56508301f4d",
          // id: "f1aed138-3cd6-4dfc-bee3-255ad4f5c37e",
          result: false,
          child: [
            {
              id: "bad71862-dc50-4223-a281-2b0c103822fb",
              result: true,
            },
            {
              id: "83a2d286-683c-4822-b969-eb4bccb44ff6",
              result: false,
            },
            {
              id: "476e5c6d-39db-4978-9f96-923069169ec9",
              result: false,
            },
          ],
        },
      ];
      const dataState = new DataState(graph, {
        graphData: viewData,
        targetData: mock1,
      });
      setDataState(dataState);
      setTimeout(() => {
        dataState.run();
      }, 3000);
    }
  }, [graph, viewData]);

  return (
    <React.Fragment>
      <Drawer graph={graph} />
      <div ref={divRef} className={styles["g6-view"]} />
    </React.Fragment>
  );
};

export default G6View;
