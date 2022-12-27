import {
  NsGraph,
  uuidv4,
  IApplication,
  NsGraphCmd,
  XFlowGraphCommands,
} from "@antv/xflow";
import { ViewRelationship, KnowledgeView } from "@/services";
import type { DataNode } from "antd/es/tree";
import { groupBy, uniqBy, mergeWith, find } from "lodash";

type IProps = {
  nodes: NsGraph.INodeConfig[];
  data: ViewRelationship[];
};

export const formatGraphData: (T: IProps) => NsGraph.IGraphData = ({
  nodes,
  data,
}) => {
  const edges = () => {
    const find = data.filter(({ parent, child }) => {
      const parentIndex = nodes.findIndex(({ id }) => id === `${parent?.id}`);
      const childIndex = nodes.findIndex(({ id }) => id === `${child?.id}`);
      return parentIndex > -1 && childIndex > -1;
    });
    return find.map((item) => {
      const [parent] = nodes.filter((list) => {
        return list.id === `${item.parent?.id}`;
      });
      const [child] = nodes.filter((list) => {
        return list.id === `${item.child?.id}`;
      });
      const sourcePortId = () => {
        const [port] = (parent?.ports as NsGraph.INodeAnchor[]).filter(
          (item) => {
            return item.type === "output";
          }
        );
        return port?.id;
      };
      const targetPortId = () => {
        const [port] = (child?.ports as NsGraph.INodeAnchor[]).filter(
          (item) => {
            return item.type === "input";
          }
        );
        return port?.id;
      };
      return {
        id: uuidv4(),
        source: `${item.parent?.id}`,
        target: `${item.child?.id}`,
        sourcePortId: sourcePortId(),
        targetPortId: targetPortId(),
      };
    });
  };

  return {
    nodes,
    edges: edges(),
  };
};

export const formatTree: (T: { data: ViewRelationship[] }) => DataNode[] = ({
  data,
}) => {
  const first = groupBy(data, "parent.id");
  const tree: DataNode[] = Object.keys(first).map((key) => {
    const item = first[key];
    const [val] = item;
    if (item.length === 1) {
      return {
        title: val.parent?.name,
        key: `${val.parent?.id}`,
        children: [
          {
            title: val.child?.name,
            key: `${val.child?.id}`,
            children: [],
          },
        ],
      };
    }
    return {
      title: val.parent?.name,
      key: `${val.parent?.id}`,
      children: item.map((item) => ({
        title: item?.child?.name,
        key: `${item?.child?.id}`,
        children: [],
      })),
    };
  });
  return tree;
};

export const treeDeep: (T: {
  key: string;
  formatTreeData: DataNode[];
}) => DataNode[] = ({ key, formatTreeData }) => {
  const find = formatTreeData.filter((item) => item.key === key);
  return find.map((item) => {
    return {
      ...item,
      children: item.children?.map((lts) => {
        const res = treeDeep({
          key: lts.key as string,
          formatTreeData,
        });
        if (res.length > 0) {
          const [val] = res;
          return val;
        }
        return lts;
      }),
    };
  });
};

export async function graphReader(
  graphData: NsGraph.IGraphData,
  app?: IApplication
) {
  const graph = await app?.getGraphInstance();
  const config = await app?.getGraphConfig();
  graph?.disableHistory();
  graph?.clearCells();
  await app?.executeCommand<
    NsGraphCmd.GraphLayout.IArgs,
    NsGraphCmd.GraphLayout.IResult
  >(XFlowGraphCommands.GRAPH_LAYOUT.id, {
    layoutType: "dagre",
    layoutOptions: {
      type: "dagre",
      /** 布局方向 */
      rankdir: "TB",
      /** 节点间距 */
      nodesep: 60,
      /** 层间距 */
      ranksep: 30,
    },
    graphData,
  });
  const format = graphData?.nodes?.map((item) => ({
    ...item,
    view: config?.graphId,
  }));
  await app?.executeCommand(XFlowGraphCommands.GRAPH_RENDER.id, {
    graphData: {
      ...graphData,
      nodes: format,
    },
  } as NsGraphCmd.GraphRender.IArgs);
  // 居中
  await app?.executeCommand<NsGraphCmd.GraphZoom.IArgs>(
    XFlowGraphCommands.GRAPH_ZOOM.id,
    {
      factor: "real",
    }
  );
  graph?.enableHistory();
}
