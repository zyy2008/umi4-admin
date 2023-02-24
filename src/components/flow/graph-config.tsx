import {
  createGraphConfig,
  NsGraph,
  XFlowNodeCommands,
  XFlowGroupCommands,
  NsGroupCmd,
  NsNodeCmd,
  uuidv4,
} from "@antv/xflow";
import { EdgeView, Cell } from "@antv/x6";
import type { IProps } from "./index";

/**  graphConfig：配置Graph  */
export const useGraphConfig = createGraphConfig<IProps>(
  (graphConfig, proxy) => {
    const { events = [] } = proxy.getValue();
    const iEvents: NsGraph.IEvent[] = [
      {
        eventName: "node:mouseenter",
        callback: (e) => {
          const {
            e: { delegateTarget },
          } = e;
          changePortsVisible(delegateTarget, true);
        },
      },
      {
        eventName: "node:mouseleave",
        callback: (e) => {
          const {
            e: { delegateTarget },
          } = e;
          changePortsVisible(delegateTarget, false);
        },
      },
      {
        eventName: "node:change:position",
        callback: (x6Event, commandService, modelService, graph) => {
          const edges = graph.getEdges();
          edges.forEach((edge) => {
            const edgeView = graph.findViewByCell(edge) as EdgeView;
            edgeView.update();
          });
        },
      },
      {
        eventName: "node:change:parent",
        callback: async (
          x6Event: { node: Cell; cell: Cell; current: string },
          commandService,
          modelService,
          graph
        ) => {
          const { node, cell, current } = x6Event;
          if (current) {
            const groupCell = graph.getCellById(current);
            const groupData: NsGraph.IGroupConfig = groupCell.getData();
            if (groupData.init) {
              groupCell.setData({
                ...groupData,
                init: false,
              });
            } else {
              cell.setData({
                ...cell.getData(),
                group: current,
                isCollapsed: false,
              });
            }
          }
        },
      },
      ...events,
    ];
    /**  这里绑定事件  */
    graphConfig.setEvents(iEvents);
  }
);

const changePortsVisible = (dom: Element, visible: boolean) => {
  const ports = dom.querySelectorAll(".x6-port-body") as NodeListOf<SVGElement>;
  for (let i = 0, len = ports.length; i < len; i = i + 1) {
    ports[i].style.visibility = visible ? "visible" : "hidden";
  }
};
