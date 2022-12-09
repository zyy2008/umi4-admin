import React from "react";
import ViewFlow from "@/components/flow";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { CustomPanel } from "./components";
import type { IAppLoad, NsGraphCmd, NsGraph, IApplication } from "@antv/xflow";
import { XFlowGraphCommands, JsonSchemaForm } from "@antv/xflow";
import { NsJsonForm } from "./form-service";
import styles from "./index.less";

type IProps = {
  callbackHistory?: (args: NsGraph.IGraphData) => void;
  callbackDisabled?: (args: boolean) => void;
};

export type ViewHandle = {
  app?: IApplication;
};

type Visibility = "hidden" | "visible";

export type CallbackVisibility = (args: Visibility) => void;

const ViewRight = React.forwardRef<ViewHandle, IProps>((props, ref) => {
  const { callbackHistory, callbackDisabled } = props;
  const [visibility, setVisibility] = React.useState<Visibility>("hidden");
  const callbackVisibility = React.useCallback<CallbackVisibility>(
    (val) => setVisibility(val),
    []
  );
  const app = React.useRef<IApplication>();
  const onLoad: IAppLoad = async (val) => {
    app.current = val;
    const graph = await val.getGraphInstance();
    graph.enableHistory();
    graph.history.on("change", () => {
      val.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
        XFlowGraphCommands.SAVE_GRAPH_DATA.id,
        {
          saveGraphDataService: async (meta, data) => {
            callbackHistory?.(data);
          },
        }
      );
    });
  };
  React.useImperativeHandle(
    ref,
    () => {
      return {
        app: app.current,
      };
    },
    [app.current]
  );
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
            targetType={["node", "edge", "canvas"]}
            position={{ top: 0, left: 0, right: 0, bottom: 0 }}
            footerPosition={{
              height: 0,
            }}
            headerPosition={{
              height: 0,
            }}
            formSchemaService={(val) =>
              NsJsonForm.formSchemaService(
                val,
                callbackVisibility,
                callbackDisabled
              )
            }
            formValueUpdateService={NsJsonForm.formValueUpdateService}
          />
        </div>
      </>
    </ViewFlow>
  );
});

export default ViewRight;
