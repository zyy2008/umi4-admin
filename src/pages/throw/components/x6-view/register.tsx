import { Graph, Cell } from "@antv/x6";
import "@antv/x6-react-shape";
import * as NodesComponent from "@/components/nodes";
import React from "react";
import { ViewContext } from "./index";
import type { NsGraph } from "@antv/xflow-core";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
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
            cell.setData({
              ...cell.getData(),
              collapse: !data?.collapse,
            });
            if (graph) {
              const run = (pre: Cell) => {
                const succ = graph.getSuccessors(pre);
                if (succ) {
                  succ.forEach((node: Cell) => {
                    node.toggleVisible();
                    const { collapse } = node.getData();
                    if (!collapse) {
                      run(node);
                    }
                  });
                }
              };
              run(cell);
            }
          }}
          className="collapse"
        >
          {data?.collapse ? (
            <span>
              <MinusCircleOutlined />
            </span>
          ) : (
            <span>
              <PlusCircleOutlined />
            </span>
          )}
        </a>
      )}
    </div>
  );
};

const NodeComponent = React.memo(Component, (prev, next: any) => {
  return !Boolean(next.node?.hasChanged("data"));
});

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
        stroke: "rgba(134, 212, 255, 1)",
        sourceMarker: null,
        targetMarker: null,
      },
    },
  },
  true
);

export default Graph;
