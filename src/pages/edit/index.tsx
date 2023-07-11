import React from "react";
import {
  JsonSchemaForm,
  NsGraph,
  NsJsonSchemaForm,
  IAppLoad,
  uuidv4,
} from "@antv/xflow";
import KnowledgeFlow, { portAttrs } from "@/components/flow";
import { NsJsonForm } from "./form-service";
import { CustomPanel } from "./components";
import { controlMapService } from "@/components/custom-form";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { useToolbarConfig } from "./toolbar-config";
import { useRequest, useSearchParams, useModel } from "@umijs/max";
import { APIS, ParamBean } from "@/services";
import { commandConfig } from "./command-config";
import { Graph } from "@antv/x6";
import json from "./chart.json";

export type Check = { uuid: string; version: string } | null;

export type CheckContext = {
  state: Check;
  setState: React.Dispatch<React.SetStateAction<Check | null>>;
  paramsLoading?: boolean;
  getParams: (T: {
    label: string;
    value?: string | number | null;
  }) => Promise<any>;
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
    async (val: { label: string; value?: any }) => {
      const { value: satId, label: satCode } = val;
      const res = await APIS.DefaultApi.baseServerDataQueryQueryTmBySidGet({
        satId,
      });
      return {
        data: res.data?.map((item) => ({
          ...item,
          satCode,
        })),
      };
    },
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
        const { nodes, edges: parseEdges } = JSON.parse(
          data?.codeContent
        ) as NsGraph.IGraphData;
        const edges = parseEdges.filter((item) => item.renderKey != "循环");
        return {
          nodes,
          edges,
        };
      }
      return json;
      return {
        nodes: [
          {
            id: uuidv4(),
            label: format?.ruleName ? format.ruleName : "Start",
            renderKey: "StartNode",
            data: format,
            width: 70,
            height: 70,
            fontSize: 14,
            ports: [
              {
                type: NsGraph.AnchorType.INPUT,
                group: NsGraph.AnchorGroup.TOP,
                tooltip: "输入桩",
                attrs: portAttrs,
                id: uuidv4(),
              },
              {
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.BOTTOM,
                tooltip: "输出桩",
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
