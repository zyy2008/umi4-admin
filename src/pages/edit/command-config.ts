import { IProps } from "@/components/flow";
import { NsEdgeCmd } from "@antv/xflow";
import { Node, Graph as X6Graph } from "@antv/x6";

export const commandConfig: IProps["commandConfig"] = (hooks) => {
  return [
    hooks.delEdge.registerHook({
      name: "after del edge and del others",
      after: "after del edge",
      handler: async (_, handler: any) => {
        const main = async (args: any) => {
          const res = (await handler(args)) as NsEdgeCmd.DelEdge.IResult;
          const { sourceCell, sourcePortId } = res;
          if (sourceCell && sourceCell.isNode() && sourcePortId) {
            const { label } = sourceCell.getData();
            switch (label) {
              case "if":
                const x6Graph = (await args.getX6Graph()) as X6Graph;
                const edges = x6Graph.getOutgoingEdges(sourceCell);
                if (edges && edges.length > 0) {
                  const [edge] = edges;
                  const sourcePortId = edge.getSourcePortId() as string;
                  const targetPortId = edge.getTargetPortId() as string;
                  const targetCell = edge.getTargetCell() as Node;
                  targetCell.setPortProp(targetPortId, "connected", false);
                  sourceCell.setPortProp(sourcePortId, "connected", false);
                  targetCell.setData({
                    ...targetCell.getData(),
                    ports: targetCell.getParsedPorts(),
                  });
                  sourceCell.setData({
                    ...sourceCell.getData(),
                    ports: sourceCell.getParsedPorts(),
                  });
                  edge.remove();
                }
                break;

              case "for":
                break;
              default:
                break;
            }
          }

          return res;
        };
        return main;
      },
    }),
    hooks.addEdge.registerHook({
      name: "after add edge add add others",
      after: "after add edge",
      handler: async (_, handler: any) => {
        const main = async (args: any) => {
          const res = (await handler(args)) as NsEdgeCmd.AddEdge.IResult;
          if (res && res.edgeCell) {
            const getSourceCell = res.edgeCell.getSourceCell() as Node;
            const getTargetCell = res.edgeCell.getTargetNode();
            console.log(getTargetCell);
            const { label } = getSourceCell.getData();
            const x6Graph = (await args.getX6Graph()) as X6Graph;
            switch (label) {
              case "if":
                const edges = x6Graph.getOutgoingEdges(getSourceCell);
                if (edges && edges.length === 1) {
                  res.edgeCell.setLabels("true");
                  res.edgeCell.setData({
                    ...res.edgeCell.getData(),
                    label: "true",
                  });
                } else {
                  res.edgeCell.setLabels("false");
                  res.edgeCell.setData({
                    ...res.edgeCell.getData(),
                    label: "false",
                  });
                }
                break;
              case "for":
                break;
              default:
                break;
            }
          }
          return res;
        };
        return main;
      },
    }),
  ];
};
