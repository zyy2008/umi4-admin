import React from "react";
import { JsonSchemaForm, NsGraph, IAppLoad, uuidv4 } from "@antv/xflow";
import BpmnFlow, { portAttrs } from "@/components/flow";
import { NsJsonForm } from "./form-service";
import { CustomPanel } from "./components";
import { controlMapService } from "@/components/custom-form";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { useToolbarConfig } from "./toolbar-config";
import { Graph } from "@antv/x6";
import classnames from "classnames";
import ReactDOM from "react-dom";
import { connecting } from "./connection";
import { nodeSubmenu } from "./sub-menu";
import { useEventEmitter } from "ahooks";
import { EventEmitter } from "ahooks/lib/useEventEmitter";

export type Check = { uuid: string; version: string } | null;

export type ContextType = {
  event$: EventEmitter<string> | null;
};
export const Context = React.createContext<ContextType>({
  event$: null,
});

const Bpmn = () => {
  const [graph, setGraph] = React.useState<Graph>();
  const toolbarConfig = useToolbarConfig();
  const onLoad: IAppLoad = async (app) => {
    const graph = await app.getGraphInstance();
    setGraph(graph);
  };
  const graphData = React.useMemo<NsGraph.IGraphData>(() => {
    if (graph) {
      return {
        nodes: [
          {
            id: uuidv4(),
            label: "开始",
            renderKey: "StartNode",
            width: 50,
            height: 50,
            fontSize: 14,
            ports: [
              {
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.TOP,
                attrs: portAttrs,
                id: uuidv4(),
              },
              {
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.RIGHT,
                attrs: portAttrs,
                id: uuidv4(),
              },
              {
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.LEFT,
                attrs: portAttrs,
                id: uuidv4(),
              },
              {
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.BOTTOM,
                attrs: portAttrs,
                id: uuidv4(),
              },
            ] as NsGraph.INodeAnchor[],
          },
        ],
        edges: [],
      };
    }
    return {
      nodes: [],
      edges: [],
    };
  }, [graph]);

  const event$ = useEventEmitter<string>();

  return (
    <Context.Provider
      value={{
        event$,
      }}
    >
      <BpmnFlow
        toolbarProps={{
          config: toolbarConfig,
        }}
        graphData={graphData}
        onLoad={onLoad}
        menuDisabled={["StartNode"]}
        connectionType="many-to-many"
        graphOptions={(opt) => ({
          ...opt,
          snapline: {
            enabled: true,
          },
          connecting: {
            ...opt.connecting,
            ...connecting,
          },
          onPortRendered(args) {
            const { port } = args;
            const { contentSelectors } = args;
            const container = contentSelectors && contentSelectors.content;
            const clz = classnames("xflow-port", {
              connected: (port as any).connected,
            });
            if (container) {
              ReactDOM.render(
                (<span className={clz} />) as React.ReactElement,
                container as HTMLElement
              );
            }
          },
        })}
        nodeSubmenu={(val) => nodeSubmenu(val, event$)}
      >
        <>
          <CustomPanel
            position={{ width: 260, top: 0, bottom: 0, left: 0 }}
            onNodeDrop={dndPanelConfig.onNodeDrop}
          />

          <JsonSchemaForm
            targetType={["node", "edge", "canvas"]}
            controlMapService={controlMapService}
            formSchemaService={NsJsonForm.formSchemaService}
            formValueUpdateService={NsJsonForm.formValueUpdateService}
            position={{ top: 0, bottom: 0, right: 0, width: 290 }}
            footerPosition={{
              height: 0,
            }}
          />
        </>
      </BpmnFlow>
    </Context.Provider>
  );
};
export default Bpmn;

export * from "./service";
