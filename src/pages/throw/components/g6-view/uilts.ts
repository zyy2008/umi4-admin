import { NsGraph } from "@antv/xflow";
import type { TreeGraphData } from "@antv/g6";
import { groupBy, Dictionary, find } from "lodash";

export const formatTree: (
  T: NsGraph.IGraphData
) => TreeGraphData | undefined = (data) => {
  const { nodes, edges } = data;
  const [rootNode] = nodes.filter(
    ({ renderKey }) => renderKey === "StartProcessNode"
  );
  if (!rootNode) return;
  const dic = groupBy(edges, "source");
  return findChildren(rootNode, nodes, dic, dic[rootNode?.id]);
};

const findChildren: (
  node: NsGraph.INodeConfig,
  nodes: NsGraph.INodeConfig[],
  dic: Dictionary<NsGraph.IEdgeConfig[]>,
  rootChildren?: NsGraph.IEdgeConfig[]
) => TreeGraphData = function (node, nodes, dic, rootChildren) {
  if (dic?.[node?.id]) {
    return {
      collapsed: false,
      ...node,
      type: node.renderKey,
      children: dic[node.id].map((item) => {
        const findNode = find(nodes, ["id", item.target]);
        return findChildren(
          {
            ...findNode,
            collapsed:
              rootChildren?.findIndex(({ target }) => target === item.id) != -1,
          } as NsGraph.INodeConfig,
          nodes,
          dic
        );
      }),
    };
  }
  const { collapsed, ...others } = node;
  return {
    ...others,
    type: others.renderKey,
  };
};
