import { createGraphConfig, NsGraph } from "@antv/xflow";
import { EdgeView } from "@antv/x6";

type IProps = {
  events?: NsGraph.IEvent[];
};

/**  graphConfig：配置Graph  */
export const useGraphConfig = createGraphConfig<any>((graphConfig, proxy) => {
  const { events = [] }: IProps = proxy.getValue();
  console.log(events);
  const iEvents: NsGraph.IEvent[] = [
    {
      eventName: "node:mouseenter",
      callback: () => {
        changePortsVisible(true);
      },
    },
    {
      eventName: "node:mouseleave",
      callback: () => {
        changePortsVisible(false);
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
    ...events,
  ];
  /**  这里绑定事件  */
  graphConfig.setEvents(iEvents);
});

const changePortsVisible = (visible: boolean) => {
  const ports = document.body.querySelectorAll(
    ".x6-port-body"
  ) as NodeListOf<SVGElement>;
  for (let i = 0, len = ports.length; i < len; i = i + 1) {
    ports[i].style.visibility = visible ? "visible" : "hidden";
  }
};
