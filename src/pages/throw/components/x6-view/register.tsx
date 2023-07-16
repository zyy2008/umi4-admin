import { Graph, Cell } from "@antv/x6";
import "@antv/x6-react-shape";
import * as NodesComponent from "@/components/nodes";
import React from "react";
import { ViewContext } from "./index";
import type { NsGraph } from "@antv/xflow-core";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import styles from "./index.less";

type IProps = {
  cell: Cell;
  nodeComponent: NsGraph.INodeRender;
};

export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}

const Component: React.FC<IProps> = ({ cell, nodeComponent }) => {
  const data = cell.getData();
  const { graph, setOpen } = React.useContext(ViewContext);
  const [collapse, setCollapse] = React.useState<string>("");

  React.useEffect(() => {
    if (graph && data) {
      const succ = graph.getSuccessors(cell);
      if (succ) {
        succ.forEach((node) => {
          node.toggleVisible(data?.collapse);
        });
      }
    }
  }, [graph, collapse]);

  const isCollapse = React.useMemo<boolean>(() => {
    if (graph) {
      const succ = graph.getSuccessors(cell, { distance: 1 });
      return succ.length > 0;
    }
    return false;
  }, [graph]);
  return (
    <div className={styles["node"]}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          graph?.cleanSelection();
          graph?.select(cell);
          setOpen?.({
            value: true,
            data: cell.getData(),
          });
        }}
      >
        {React.createElement(nodeComponent, {
          data,
          size: data?.size,
          position: {
            x: 0,
            y: 0,
          },
        })}
      </div>
      {isCollapse && (
        <a
          onClick={(e) => {
            e.stopPropagation();
            setCollapse(`${new Date().getTime()}`);
            cell.setData({
              ...cell.getData(),
              collapse: !data?.collapse,
            });
          }}
          className="collapse"
        >
          {data?.collapse ? (
            <span>
              <MinusOutlined />
            </span>
          ) : (
            <span>
              <PlusOutlined />
            </span>
          )}
        </a>
      )}
    </div>
  );
};

const NodeComponent = React.memo(Component);

Object.keys(NodesComponent).forEach((key) => {
  if (isValidKey(key, NodesComponent)) {
    Graph.registerNode(
      key,
      {
        inherit: "react-shape",
        component: (cell: Cell) => {
          return (
            <NodeComponent nodeComponent={NodesComponent[key]} cell={cell} />
          );
        },
      },
      true
    );
  }
});

Graph.registerEdge(
  "org-edge",
  {
    zIndex: -1,
    attrs: {
      line: {
        fill: "none",
        strokeLinejoin: "round",
        strokeWidth: 2,
        stroke: "#A2B1C3",
        sourceMarker: null,
        targetMarker: null,
      },
    },
  },
  true
);

export default Graph;
