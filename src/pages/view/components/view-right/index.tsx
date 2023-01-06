import React from "react";
import ViewFlow from "@/components/flow";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { CustomPanel } from "./components";
import type { IAppLoad, NsGraphCmd, NsGraph, IApplication } from "@antv/xflow";
import { XFlowGraphCommands, JsonSchemaForm } from "@antv/xflow";
import { NsJsonForm } from "./form-service";
import styles from "./index.less";

export * from "./components";

type IProps = {
  setGraphData?: (args: NsGraph.IGraphData) => void;
  setDisabled?: (args: boolean) => void;
  graphData?: NsGraph.IGraphData;
  children?: React.ReactNode;
};

export type ViewHandle = {
  app?: IApplication;
};

type Visibility = "hidden" | "visible";

const ViewRight = React.forwardRef<ViewHandle, IProps>((props, ref) => {
  const { setGraphData, setDisabled, graphData } = props;
  const [app, setApp] = React.useState<IApplication>();
  const [visibility, setVisibility] = React.useState<Visibility>("hidden");

  const onLoad: IAppLoad = async (app) => {
    const graph = await app.getGraphInstance();
    graph.enableHistory();
    graph.history.on("change", () => {
      app.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
        XFlowGraphCommands.SAVE_GRAPH_DATA.id,
        {
          saveGraphDataService: async (meta, data) => {
            setGraphData?.(data);
          },
        }
      );
    });
    setApp(app);
  };
  React.useImperativeHandle(
    ref,
    () => {
      return {
        app: app,
      };
    },
    [app]
  );
  return (
    <ViewFlow
      position={{ left: 160, right: 0 }}
      connectionType="one-to-many"
      onLoad={onLoad}
      menuDisabled={["edge"]}
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
              NsJsonForm.formSchemaService(val, setVisibility, setDisabled)
            }
            formValueUpdateService={NsJsonForm.formValueUpdateService}
          />
        </div>
      </>
    </ViewFlow>
  );
});

export default React.memo(ViewRight);
