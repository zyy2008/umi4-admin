import { default as ifHandle } from "./if";
import { default as forHandle } from "./for";
import { default as switchHandle } from "./switch";
import { default as targetStartHandle } from "./targetStart";
import { default as sourceStartHandle } from "./sourceStart";
import { Graph } from "@antv/x6";

export const addEdge = ({
  x6Graph,
  targetId,
  sourceId,
}: {
  x6Graph: Graph;
  targetId: string;
  sourceId: string;
}) => {
  x6Graph.addEdge({
    source: {
      cell: targetId,
      anchor: {
        name: "right",
      },
    },
    data: {
      renderKey: "循环",
    },
    router: {
      name: "oneSide",
      args: {
        side: "right",
      },
    },
    label: "循环",
    attrs: {
      line: {
        stroke: "#A2B1C3",
        strokeWidth: 2,
        targetMarker: {
          name: "block",
          width: 12,
          height: 8,
        },
      },
    },
    target: {
      cell: sourceId,
      anchor: {
        name: "right",
        args: {
          dx: -14,
        },
      },
    },
  });
};

export default {
  if: ifHandle,
  for: forHandle,
  while: forHandle,
  switch: switchHandle,
  targetStart: targetStartHandle,
  sourceStart: sourceStartHandle,
};
