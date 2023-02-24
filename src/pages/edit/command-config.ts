import { IProps } from "@/components/flow";
import {
  NsEdgeCmd,
  IGraphCommandService,
  XFlowEdgeCommands,
  uuidv4,
  NsGraph,
} from "@antv/xflow";
import { Node, Graph as X6Graph } from "@antv/x6";
import addEdgeHandle from "./add-edge";

export const commandConfig: IProps["commandConfig"] = (hooks) => {
  return [
    hooks.delEdge.registerHook({
      name: "after del edge and del others",
      after: "after del edge",
      handler: async (_, handler: any) => {
        const main = async (args: any) => {
          const res = (await handler(args)) as NsEdgeCmd.DelEdge.IResult;
          const commandService: IGraphCommandService = args.commandService;
          const { sourceCell, sourcePortId } = res;
          if (sourceCell && sourceCell.isNode() && sourcePortId) {
            const { label } = sourceCell.getData();
            const x6Graph = (await args.getX6Graph()) as X6Graph;
            switch (label) {
              case "if":
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
              case "while":
                var targetCell = res.targetCell as Node;
                const ports = targetCell.getPorts();
                const [{ id }] = ports.filter(
                  (item) => item.group === "bottom"
                );
                targetCell.setPortProp(id as string, "connected", false);
                const targetEdges = x6Graph.getOutgoingEdges(targetCell);
                if (targetEdges && targetEdges.length > 0) {
                  const [edge] = targetEdges;
                  edge.remove();
                }
                break;
              case "switch":
                var targetCell = res.targetCell as Node;
                const [edge] = x6Graph.getOutgoingEdges(targetCell) ?? [];
                commandService.executeCommand<
                  NsEdgeCmd.DelEdge.IArgs,
                  NsEdgeCmd.DelEdge.IResult
                >(XFlowEdgeCommands.DEL_EDGE.id, {
                  edgeConfig: edge.getData(),
                });
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
          const commandService: IGraphCommandService = args.commandService;
          const { edgeConfig, edgeCell } = res;
          if (edgeCell && edgeConfig) {
            const { sourcePortId } = edgeConfig;
            const sourceCell = edgeCell.getSourceCell() as Node;
            const targetCell = edgeCell.getTargetCell() as Node;
            const { label, ports, renderKey } =
              sourceCell.getData() as NsGraph.INodeConfig;
            const x6Graph = (await args.getX6Graph()) as X6Graph;
            const { id: sourceId } = sourceCell;
            const { id: targetId } = targetCell;
            switch (label) {
              case "if":
                const edges = x6Graph.getOutgoingEdges(sourceCell);
                if (edges && edges.length === 1) {
                  edgeCell.setLabels("true");
                  edgeCell.setData({
                    ...edgeCell.getData(),
                    label: "true",
                  });
                } else {
                  edgeCell.setLabels("false");
                  edgeCell.setData({
                    ...edgeCell.getData(),
                    label: "false",
                  });
                }
                break;
              case "for":
                // addEdge({
                //   x6Graph,
                //   sourceId,
                //   targetId,
                // });
                addEdgeHandle["for"]({
                  commandService,
                  x6Graph,
                  sourceCell,
                  targetCell,
                });
                break;
              case "while":
                const port = sourceCell.getPort(sourcePortId as string);
                if (port?.group === "bottom") {
                  edgeCell.setLabels("true");
                  edgeCell.setData({
                    ...edgeCell.getData(),
                    label: "true",
                  });
                  // addEdge({
                  //   x6Graph,
                  //   sourceId,
                  //   targetId,
                  // });
                  const ports = targetCell.getPorts();
                  const [{ id }] = ports.filter(
                    (item) => item.group === "bottom"
                  );
                  targetCell.setPortProp(id as string, "connected", true);
                }
                if (port?.group === "left") {
                  edgeCell.setLabels("false");
                  edgeCell.setData({
                    ...edgeCell.getData(),
                    label: "false",
                  });
                }

                break;
              case "switch":
                const [{ tooltip }] =
                  (ports as NsGraph.INodeAnchor[]).filter(
                    ({ id }) => id === sourcePortId
                  ) ?? [];
                const text = tooltip?.substring(4) ?? "";
                edgeCell.setLabels(text);
                edgeCell.setData({
                  ...edgeCell.getData(),
                  label: text,
                });
                break;
              default:
                break;
            }
            const edges =
              x6Graph.getIncomingEdges(sourceCell) ||
              x6Graph.getIncomingEdges(targetCell);
            if (edges && edges.length > 0) {
              const [edge] = edges;
              const targetCell = edge.getSourceCell() as Node;
              const { label } = targetCell.getData();
              if (label === "switch") {
                const edges = x6Graph.getOutgoingEdges(targetCell);
                const targetCells = edges?.map((edge) => {
                  return edge.getTargetCell();
                });
                const yesOutgo: Node[] = [];
                const noOutgo: Node[] = [];
                targetCells?.forEach((cell) => {
                  const edges = x6Graph.getOutgoingEdges(cell as Node);
                  if (edges && edges.length > 0) {
                    yesOutgo.push(cell as Node);
                  } else {
                    noOutgo.push(cell as Node);
                  }
                });
                if (yesOutgo?.length > 0) {
                  const [cell] = yesOutgo;
                  const [edge] = x6Graph.getOutgoingEdges(cell as Node) ?? [];
                  const id = edge.getTargetCellId();
                  const targetCell = edge.getTargetCell() as Node;
                  const ports = targetCell?.getPorts();
                  const [{ id: targetPortId }] = ports.filter(
                    (item) => item.type === "input"
                  );
                  noOutgo?.forEach((cell) => {
                    const ports = cell.getPorts();
                    const [{ id: sourcePortId }] = ports.filter(
                      (item) => item.type === "output"
                    );
                    commandService.executeCommand<
                      NsEdgeCmd.AddEdge.IArgs,
                      NsEdgeCmd.AddEdge.IResult
                    >(XFlowEdgeCommands.ADD_EDGE.id, {
                      edgeConfig: {
                        id: uuidv4(),
                        target: id,
                        source: cell.id,
                        sourcePortId,
                        targetPortId,
                      },
                    });
                  });
                }
              }
            }
          }
          return res;
        };
        return main;
      },
    }),
  ];
};
