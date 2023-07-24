import React from "react";
import G6, { ShapeOptions } from "@antv/g6";
import {
  Rect,
  Text,
  Circle,
  Group,
  createNodeFromReact,
} from "@antv/g6-react-node";
import { ModelConfig } from "@antv/g6-core/lib";
import { NsGraph } from "@antv/xflow";
import { IShape } from "@antv/g-base";
import { IAbstractGraph, IG6GraphEvent, Item } from "@antv/g6-core";

type ShapeEventListner = (
  event: IG6GraphEvent,
  node: Item | null,
  shape: IShape,
  graph: IAbstractGraph
) => void;

const onNodeClick: ShapeEventListner = (_, node, shape, graph) => {
  graph.emit("onNodeDrawer", node);
};

const RectNode = (props: { cfg: ModelConfig }) => {
  const { cfg } = props;
  const {
    label = "label",
    fontFill,
    fontSize,
    collapsed,
    children,
  } = cfg as NsGraph.INodeConfig;
  const onClick: ShapeEventListner = (evt, node, shape, graph) => {
    node &&
      graph.updateItem(node, {
        collapsed: !collapsed,
      });
    graph.layout();
    graph.fitView();
    graph.fitCenter();
  };

  return (
    <Group draggable>
      <Rect
        style={{
          ...cfg,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          cursor: "pointer",
        }}
        onClick={onNodeClick as any}
      >
        <Text
          style={{
            fill: fontFill,
            fontSize,
            cursor: "pointer",
          }}
          onClick={onNodeClick as any}
        >
          {label}
        </Text>
      </Rect>
      {children?.length > 0 && (
        <Rect
          style={{
            padding: [1, 0, 0, 0],
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Circle
            style={{
              r: 6,
              justifyContent: "center",
              alignItems: "center",
              stroke: "rgba(134, 212, 255, 1)",
            }}
          >
            <Text
              style={{
                fill: "rgba(134, 212, 255, 1)",
                fontSize: 10,
                cursor: "pointer",
              }}
              onClick={onClick as any}
            >
              {collapsed ? "+" : "-"}
            </Text>
          </Circle>
        </Rect>
      )}
    </Group>
  );
};

const CircleNode = (props: { cfg: ModelConfig }) => {
  const { cfg } = props;
  const { label = "label", fontFill, fontSize } = cfg as NsGraph.INodeConfig;
  return (
    <Group draggable>
      <Circle
        style={{
          ...cfg,
          r: 30,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          cursor: "pointer",
        }}
        onClick={onNodeClick as any}
      >
        <Text
          style={{
            fill: fontFill,
            fontSize,
            cursor: "pointer",
          }}
          onClick={onNodeClick as any}
        >
          {label}
        </Text>
      </Circle>
    </Group>
  );
};

const SquareNode = (props: { cfg: ModelConfig }) => {
  const { cfg } = props;
  const { label = "label", fontFill, fontSize } = cfg as NsGraph.INodeConfig;
  return (
    <Group draggable>
      <Rect
        style={{
          ...cfg,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          cursor: "pointer",
        }}
        onClick={onNodeClick as any}
      >
        <Text
          style={{
            fill: fontFill,
            fontSize,
            cursor: "pointer",
          }}
          onClick={onNodeClick as any}
        >
          {label}
        </Text>
      </Rect>
    </Group>
  );
};

const options: ShapeOptions = {
  getAnchorPoints(cfg) {
    return cfg?.anchorPoints;
  },
  setState(name, value, item) {
    console.log(name);
  },
};

G6.registerNode("StartProcessNode", {
  ...createNodeFromReact(RectNode),
  ...options,
});

G6.registerNode("ProcessNode", {
  ...createNodeFromReact(RectNode),
  ...options,
});

G6.registerNode("ConnectorNode", {
  ...createNodeFromReact(CircleNode),
  ...options,
});

G6.registerNode("SquareNode", {
  ...createNodeFromReact(SquareNode),
  ...options,
});

export default G6;
