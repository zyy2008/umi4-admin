import ViewFlow from "@/components/flow";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { CustomPanel } from "./components";
import type { IAppLoad, NsGraph } from "@antv/xflow";
import {
  XFlow,
  createGraphConfig,
  XFlowCanvas,
  XFlowGraphCommands,
  MODELS,
  useXFlowApp,
  useModelAsync,
} from "@antv/xflow";

const ViewRight = () => {
  const events: NsGraph.IEvent[] = [
    // {
    //   eventName: "history:change",
    //   callback: () => {
    //     console.log("2222");
    //   },
    // },
  ];
  const onLoad: IAppLoad = async (app) => {
    const graph = await app.getGraphInstance();
    graph.enableHistory();
    console.log(graph.isHistoryEnabled());
    graph.history.on("change", () => {
      console.log("12321321");
    });
  };
  return (
    <ViewFlow
      position={{ left: 160, right: 0 }}
      connectionType="one-to-many"
      events={events}
      onLoad={onLoad}
    >
      <CustomPanel
        position={{ width: 160, top: 0, bottom: 0, left: 0 }}
        onNodeDrop={dndPanelConfig.onNodeDrop}
      />
    </ViewFlow>
  );
};

export default ViewRight;
