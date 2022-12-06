import React from "react";
import ViewFlow from "@/components/flow";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { CustomPanel } from "./components";
import type { IAppLoad, NsGraphCmd, NsGraph } from "@antv/xflow";
import { XFlowGraphCommands, JsonSchemaForm } from "@antv/xflow";
import { NsJsonForm } from "./form-service";
import styles from "./index.less";

type IProps = {
  historyData?: (T: NsGraph.IGraphData) => void;
};

type Visibility = "hidden" | "visible";

export type CallbackType = (args: Visibility) => void;

const ViewRight: React.FC<IProps> = (props) => {
  const { historyData } = props;
  const [visibility, setVisibility] = React.useState<Visibility>("hidden");
  const visibilityCb = React.useCallback<CallbackType>(
    (val) => setVisibility(val),
    []
  );
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
      <>
        <CustomPanel
          position={{ width: 160, top: 0, bottom: 0, left: 0 }}
          onNodeDrop={dndPanelConfig.onNodeDrop}
        />
        <div
          className={styles["flow-edit"]}
          style={{
            visibility,
          }}
        >
          <JsonSchemaForm
            className="abcde"
            targetType={["node", "edge", "canvas"]}
            position={{ top: 0, left: 0, right: 0, bottom: 0 }}
            footerPosition={{
              height: 0,
            }}
            headerPosition={{
              height: 0,
            }}
            formSchemaService={(val) =>
              NsJsonForm.formSchemaService(val, visibilityCb)
            }
            formValueUpdateService={NsJsonForm.formValueUpdateService}
          />
        </div>
      </>
    </ViewFlow>
  );
};

export default ViewRight;
