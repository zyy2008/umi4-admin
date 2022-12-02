import React from "react";
import ViewFlow from "@/components/flow";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { CustomPanel } from "./components";
import type { IAppLoad, NsGraphCmd, NsGraph } from "@antv/xflow";
import { XFlowGraphCommands } from "@antv/xflow";

type IProps = {
  historyData?: (T: NsGraph.IGraphData) => void;
};

const ViewRight: React.FC<IProps> = (props) => {
  const { historyData } = props;
  const onLoad: IAppLoad = async (app) => {
    const graph = await app.getGraphInstance();
    graph.enableHistory();
    graph.history.on("change", () => {
      app.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
        XFlowGraphCommands.SAVE_GRAPH_DATA.id,
        {
          saveGraphDataService: async (meta, data) => {
            historyData?.(data);
          },
        }
      );
    });
  };
  return (
    <ViewFlow
      position={{ left: 160, right: 0 }}
      connectionType="one-to-many"
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
