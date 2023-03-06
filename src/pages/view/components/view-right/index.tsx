import React from "react";
import ViewFlow from "@/components/flow";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { CustomPanel } from "./components";
import type { IAppLoad, NsGraph, IApplication } from "@antv/xflow";
import { JsonSchemaForm } from "@antv/xflow";
import { Cell } from "@antv/x6";
import { NsJsonForm } from "./form-service";
import { commandConfig } from "./command-config";
import styles from "./index.less";
import { controlMapService } from "@/components/custom-form";

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

let timer: any = null;

const ViewRight = React.forwardRef<ViewHandle, IProps>((props, ref) => {
  const { setGraphData, setDisabled, graphData } = props;
  const [app, setApp] = React.useState<IApplication>();
  const [visibility, setVisibility] = React.useState<Visibility>("hidden");

  const onLoad: IAppLoad = async (app) => {
    const graph = await app.getGraphInstance();
    graph.enableHistory();
    graph.history.on("change", ({ options }) => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      } else {
        timer = setTimeout(() => {
          const x6Nodes = graph.getNodes();
          const x6Edges = graph.getEdges();
          const nodes = x6Nodes.map((node) => {
            const data = node.getData<NsGraph.INodeConfig>();
            const position = node.position();
            const size = node.size();
            const model = {
              ...data,
              ...position,
              ...size,
            };
            return model;
          });

          const edges = x6Edges.map((edge: Cell) => {
            const data = edge.getData<NsGraph.IEdgeConfig>();
            const model = {
              ...data,
            };
            return model;
          });
          setGraphData?.({
            nodes,
            edges,
          });
        }, 0);
      }
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
      commandConfig={commandConfig}
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
            controlMapService={controlMapService}
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
