import { Graph, Cell } from "@antv/x6";
import "@antv/x6-react-shape";
import * as NodesComponent from "@/components/nodes";
import React from "react";

export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}

Object.keys(NodesComponent).forEach((key) => {
  if (isValidKey(key, NodesComponent)) {
    Graph.registerNode(
      key,
      {
        inherit: "react-shape",
        component: (cell: Cell) => {
          const data = cell.getData();
          return React.createElement(NodesComponent[key], {
            data,
            size: data?.size,
          });
        },
      },
      true
    );
  }
});

export default Graph;
