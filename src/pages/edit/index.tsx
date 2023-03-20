import React from "react";
import {
  JsonSchemaForm,
  NsGraph,
  NsJsonSchemaForm,
  IAppLoad,
  uuidv4,
} from "@antv/xflow";
import KnowledgeFlow from "@/components/flow";
import { NsJsonForm } from "./form-service";
import { CustomPanel } from "./components";
import { controlMapService } from "@/components/custom-form";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { useToolbarConfig } from "./toolbar-config";
import { useRequest, useSearchParams } from "@umijs/max";
import { APIS, ParamBean } from "@/services";
import { commandConfig } from "./command-config";
import { Graph } from "@antv/x6";

export type Check = { uuid: string; version: string } | null;

export type CheckContext = {
  state: Check;
  setState: React.Dispatch<React.SetStateAction<Check | null>>;
  paramsLoading?: boolean;
  getParams: (...args: any) => Promise<any>;
  params?: ParamBean[];
};
export const Context = React.createContext<CheckContext | null>(null);

const Edit = () => {
  const [state, setState] = React.useState<Check>({
    uuid: "",
    version: "",
  });
  const [graph, setGraph] = React.useState<Graph>();
  const [searchParams] = useSearchParams();
  const object = searchParams.get("object");
  const toolbarConfig = useToolbarConfig(setState);
  const { data, run } = useRequest(
    () =>
      APIS.DefaultApi.kmsZsbjServerApiKnowledgeViewGet({
        uuid: "",
        version: "",
        ...state,
      }),
    {
      manual: true,
    }
  );
  const {
    data: params,
    loading: paramsLoading,
    run: getParams,
  } = useRequest(
    (satId) => APIS.DefaultApi.baseServerDataQueryQueryTmBySidGet({ satId }),
    {
      manual: true,
    }
  );

  const onLoad: IAppLoad = async (app) => {
    const graph = await app.getGraphInstance();
    setGraph(graph);
  };
  React.useEffect(() => {
    if (state?.uuid) {
      run();
    }
  }, [state]);
  const graphData = React.useMemo<NsGraph.IGraphData>(() => {
    if (graph) {
      const { width } = graph?.getGraphArea();
      let format: any;
      if (object) {
        try {
          format = JSON.parse(object);
        } catch (error) {
          format = {};
          console.error("地址传参格式异常，请检查！");
        }
      }
      if (data?.codeContent) {
        return JSON.parse(data?.codeContent);
      }
      return {
        nodes: [
          {
            id: uuidv4(),
            label: format?.ruleName ? format.ruleName : "start",
            renderKey: "StartNode",
            width: 70,
            height: 70,
            // x: (width - 35) / 2,
            // y: 100,
            ports: [
              {
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.BOTTOM,
                tooltip: "输出桩",
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
  }, [data, graph, object]);

  const formSchemaService: NsJsonSchemaForm.IFormSchemaService =
    React.useCallback(
      (args) => NsJsonForm.formSchemaService(args, params),
      [paramsLoading]
    );

  const formValueUpdateService: NsJsonSchemaForm.IFormValueUpdateService =
    React.useCallback(
      (args) => NsJsonForm.formValueUpdateService(args, graph),
      [graph]
    );

  return (
    <Context.Provider
      value={{ state, setState, paramsLoading, getParams, params }}
    >
      <KnowledgeFlow
        toolbarProps={{
          config: toolbarConfig,
        }}
        cardProps={{
          title: "知识编辑器",
        }}
        graphData={graphData}
        commandConfig={commandConfig}
        onLoad={onLoad}
      >
        <>
          <CustomPanel
            position={{ width: 260, top: 0, bottom: 0, left: 0 }}
            onNodeDrop={dndPanelConfig.onNodeDrop}
          />

          <JsonSchemaForm
            targetType={["node", "edge", "canvas"]}
            controlMapService={controlMapService}
            formSchemaService={formSchemaService}
            formValueUpdateService={formValueUpdateService}
            position={{ top: 0, bottom: 0, right: 0, width: 290 }}
            footerPosition={{
              height: 0,
            }}
          />
        </>
      </KnowledgeFlow>
    </Context.Provider>
  );
};
export default Edit;
