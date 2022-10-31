/* eslint-disable @typescript-eslint/lines-between-class-members */
import { ReactShape } from "@antv/x6-react-shape";
import { Node } from "@antv/x6";
import {
  XFLOW_NODE_SHAPE,
  NODE_DEFAULT_WIDTH,
  NODE_DEFAULT_HEIGHT,
} from "./constants";
import { NsGraph, XFlowConstants } from "@antv/xflow-core";

let XFlowNode: Node.Definition;

const { AnchorGroup } = NsGraph;

if (Node.registry.exist(XFLOW_NODE_SHAPE)) {
  XFlowNode = Node.registry.get(XFLOW_NODE_SHAPE) as any;
} else {
  XFlowNode = ReactShape.define({
    width: NODE_DEFAULT_WIDTH,
    height: NODE_DEFAULT_HEIGHT,
    shape: XFLOW_NODE_SHAPE,
    // X6_NODE_PORTAL_NODE_VIEW
    view: XFlowConstants.X6_NODE_PORTAL_NODE_VIEW,
    ports: {
      groups: {
        top: {
          zIndex: 2,
          position: {
            name: AnchorGroup.TOP,
          },
        },
        bottom: {
          zIndex: 2,
          position: {
            name: AnchorGroup.BOTTOM,
          },
        },
        right: {
          zIndex: 2,
          position: {
            name: AnchorGroup.RIGHT,
          },
        },
        left: {
          zIndex: 2,
          position: {
            name: AnchorGroup.LEFT,
          },
        },
      },
    },
    attrs: {
      body: {
        magnet: false,
        fill: "none",
        stroke: "none",
        refWidth: "100%",
        refHeight: "100%",
        zIndex: 1,
      },
    },
    portMarkup: [
      {
        tagName: "g",
        selector: "xflow-port-group",
        className: "xflow-port-group",
        attrs: {
          width: 8,
          height: 8,
          x: -4,
          y: -4,
          zIndex: 10,
          // magnet决定是否可交互
          magnet: "true",
        },
        children: [
          {
            tagName: "circle",
            selector: "xflow-port",
            className: "xflow-port",
            attrs: {
              r: 4,
              fill: "#fff",
              stroke: "#d9d9d9",
              zIndex: 12,
            },
          },
        ],
      },
    ],
  });
}

export { XFlowNode, AnchorGroup };
