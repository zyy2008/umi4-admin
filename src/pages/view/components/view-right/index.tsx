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
  callbackHistory?: (args: NsGraph.IGraphData) => void;
  callbackDisabled?: (args: boolean) => void;
  graphData?: NsGraph.IGraphData;
};

export type ViewHandle = {
  app?: IApplication;
};

type Visibility = "hidden" | "visible";

export type CallbackVisibility = (args: Visibility) => void;

const ViewRight = React.forwardRef<ViewHandle, IProps>((props, ref) => {
  const { callbackHistory, callbackDisabled, graphData } = props;
  const [app, setApp] = React.useState<IApplication>();
  const [visibility, setVisibility] = React.useState<Visibility>("hidden");
  const callbackVisibility = React.useCallback<CallbackVisibility>(
    (val) => setVisibility(val),
    []
  );
  const onLoad: IAppLoad = async (val) => {
    const graph = await val.getGraphInstance();
    graph.enableHistory();
    graph.history.on("change", () => {
      val.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
        XFlowGraphCommands.SAVE_GRAPH_DATA.id,
        {
          saveGraphDataService: async (meta, data) => {
            // console.log(data);
            // callbackHistory?.(data);
          },
        }
      );
    });
    setApp(val);
  };
  React.useEffect(() => {
    if (app && graphData) {
      (async () => {
        const graph = await app.getGraphInstance();
        const config = await app.getGraphConfig();
        graph.clearCells();
        await app.executeCommand<
          NsGraphCmd.GraphLayout.IArgs,
          NsGraphCmd.GraphLayout.IResult
        >(XFlowGraphCommands.GRAPH_LAYOUT.id, {
          layoutType: "dagre",
          layoutOptions: {
            type: "dagre",
            /** 布局方向 */
            rankdir: "TB",
            /** 节点间距 */
            nodesep: 60,
            /** 层间距 */
            ranksep: 30,
          },
          graphData,
        });
        const format = graphData.nodes.map((item) => ({
          ...item,
          view: config.graphId,
        }));
        await app.executeCommand(XFlowGraphCommands.GRAPH_RENDER.id, {
          graphData: {
            ...graphData,
            nodes: format,
          },
        } as NsGraphCmd.GraphRender.IArgs);
      })();
    }
  }, [app, graphData]);
  React.useImperativeHandle(
    ref,
    () => {
      return {
        app,
      };
    },
    [app]
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
