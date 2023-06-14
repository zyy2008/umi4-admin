import { NsGraph } from "@antv/xflow";
import { returnType } from "@/pages/edit/controls";

type RenderKey = keyof typeof nodeToString;

type NodeToString = (T: NsGraph.INodeConfig) => string;

const nodeToString: {
  DecisionNode: NodeToString; //IF
  MultiDocumentNode: NodeToString; //函数
  ProcessNode: NodeToString; //变量
  ConnectorNode: NodeToString; //参数
} = {
  DecisionNode: (node) => {
    let str: string = "";
    if (node?.true) {
      str = `IF\n${node?.expression ?? ""}\nTHEN\n${node?.true
        ?.map(
          (item: NsGraph.INodeConfig) =>
            nodeToString?.[item.renderKey as RenderKey]?.(item) ?? ""
        )
        ?.join("\n")}`;
    }
    if (node?.false) {
      str += `\nELSE\n ${node?.false
        ?.map(
          (item: NsGraph.INodeConfig) =>
            nodeToString?.[item.renderKey as RenderKey]?.(item) ?? ""
        )
        ?.join("\n")}`;
    }
    return str;
  },
  MultiDocumentNode: (node) => {
    const paramValues = `${node?.funName}(${
      node?.paramValues
        ?.map((item: NsGraph.INodeConfig) => item?.fieldValue)
        ?.filter(Boolean)
        ?.join() ?? ""
    })`;
    if (node?.returnType === 5) {
      return paramValues;
    }
    return `${returnType?.[node?.returnType - 1]} ${
      node?.name
    } = ${paramValues}`;
  },
  ProcessNode: (node) => {
    const str = `${returnType?.[node?.type - 1] ?? ""} ${node?.name}`;
    if (node?.expression) {
      return `${str} = ${
        node?.type === 3 ? `"${node?.expression}"` : node?.expression
      }`;
    }
    return str;
  },
  ConnectorNode: (node) => {
    return `${returnType?.[node?.tmDataType - 1]} ${node?.name}=${
      node?.satCode
    }.${node.tmCode}.value Name "${node.tmName}"`;
  },
};

const nodesFormat: (
  sourceId: string,
  data: NsGraph.INodeConfig[],
  edges: NsGraph.IEdgeConfig[]
) => NsGraph.INodeConfig[] = (sourceId, data, edges) => {
  const findEdges = edges.filter((item) => item.source === sourceId);
  const outputNodes = data.filter((item) => {
    return findEdges.findIndex(({ target }) => target === item.id) > -1;
  });
  if (outputNodes.length === 1) {
    const [{ id, label }] = outputNodes;
    if (label === "if") {
      const findEdges = edges.filter((item) => item.source === id);
      const isOr = findEdges.filter(
        (item) => item.label === "false" || item.label === "true"
      );
      return [
        ...outputNodes.map((item) => {
          const entries: any[] = isOr.map((item) => {
            const sourceNode = data.filter(({ id }) => id === item.target);
            return [
              item.label,
              [...sourceNode, ...nodesFormat(item.target, data, edges)],
            ];
          });
          return {
            ...item,
            ...Object.fromEntries(entries),
          };
        }),
        ...nodesFormat(
          id,
          data,
          edges.filter((item) => {
            return (
              isOr.findIndex(({ target }) => target === item.target) === -1
            );
          })
        ),
      ];
    }
    return [...outputNodes, ...nodesFormat(id, data, edges)];
  }
  return [];
};

const sequence: (T: NsGraph.IGraphData) => any[] = (data) => {
  const { nodes, edges } = data;
  const [startNode] = nodes.filter((item) => item.renderKey === "StartNode");
  const findEdges = edges.filter((item) => item.target === startNode.id);
  const entryParams = nodes.filter((item) => {
    return findEdges.findIndex(({ source }) => source === item.id) > -1;
  });
  const othersNodes = nodes.filter((item) => {
    return (
      [...entryParams, startNode].findIndex(({ id }) => item.id === id) === -1
    );
  });
  const bodyFormat = nodesFormat(startNode.id, othersNodes, edges);
  return [startNode, entryParams, bodyFormat];
};

const handleParams: (T: NsGraph.INodeConfig[]) => string = (data) => {
  const format = data.map((item) => {
    return nodeToString["ConnectorNode"](item);
  });
  return format.join("");
};

const handleBody: (T: NsGraph.INodeConfig[]) => string = (data) => {
  const format = data.map((item) => {
    return nodeToString?.[item.renderKey as RenderKey]?.(item) ?? "";
  });
  return format.join("\n");
};

export const formatJson: (T: NsGraph.IGraphData) => string = (data) => {
  const sequences = sequence(data);
  const [startNode, entryParams, bodyNodes] = sequences;
  return `defrule ${startNode.label} {\n${handleParams(
    entryParams
  )}${handleBody(bodyNodes)}\n}`;
};
