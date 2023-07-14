import React from "react";
import data from "../../json";
import Graph from "./register";
import { Cell } from "@antv/x6";
import { DagreLayout } from "@antv/layout";

type IProps = {
  selectValue?: number;
};

const X6View: React.FC<IProps> = (props) => {
  const { selectValue } = props;
  const divRef = React.useRef<HTMLDivElement>(null);
  const [graph, setGraph] = React.useState<Graph>();
  React.useEffect(() => {
    if (divRef.current) {
      // 初始化画布
      const graph = new Graph({
        container: divRef.current,
        grid: true,
        connecting: {
          allowBlank: false,
          allowPort: false,
          router: {
            name: "manhattan",
            args: {
              startDirections: ["bottom"],
              endDirections: ["top"],
              padding: 40,
            },
          },
          connectionPoint: "boundary",
        },
        interacting: false,
      });
      setGraph(graph);
    }
  }, [divRef.current]);
  React.useEffect(() => {
    if (graph) {
      const nowData = data[0];
      const gridLayout = new DagreLayout({
        type: "dagre",
        rankdir: "TB",
        align: void 0,
        ranksep: 40,
        nodesep: 30,
        controlPoints: false,
      });
      const model = gridLayout.layout({
        ...nowData,
        nodes: nowData.nodes.map(
          ({ id, renderKey: shape, width, height, label, fontSize }) => ({
            id,
            shape,
            width,
            height,
            data: {
              label,
              fontSize,
              size: {
                width,
                height,
              },
            },
          })
        ),
      });
      graph.fromJSON(model);
      graph.centerContent();
    }
  }, [graph, selectValue]);
  return (
    <div
      ref={divRef}
      style={{
        height: "100%",
      }}
    />
  );
};

export default X6View;
