import React from "react";
import Flow, { portAttrs } from "@/components/flow";
import { CustomPanel } from "./components";
import { useToolbarConfig } from "./toolbar-config";
import { JsonSchemaForm, uuidv4, NsGraph, IAppLoad } from "@antv/xflow";
import { controlMapService } from "@/components/custom-form";
import { NsJsonForm } from "./form-service";
import { Graph } from "@antv/x6";
import data from "./json";

const Edit: React.FC = () => {
  const toolbarConfig = useToolbarConfig();
  const [graph, setGraph] = React.useState<Graph>();
  const onLoad: IAppLoad = async (app) => {
    const graph = await app.getGraphInstance();
    setGraph(graph);
  };
  const graphData = React.useMemo<NsGraph.IGraphData>(() => {
    return data[1].graphData;
    return {
      nodes: [
        {
          id: uuidv4(),
          label: "开始",
          renderKey: "StartProcessNode",
          width: 110,
          height: 50,
          fontSize: 14,
          fill: "rgba(90, 120, 200, 0.56)",
          fontFill: "#ebf7ff",
          ports: [
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
  }, [graph]);
  return (
    <Flow
      toolbarProps={{
        config: toolbarConfig,
      }}
      connectionType="one-to-many"
      graphData={graphData}
      graphOptions={() => ({
        snapline: true,
      })}
      onLoad={onLoad}
      menuDisabled={["StartProcessNode"]}
    >
      <React.Fragment>
        <CustomPanel position={{ width: 260, top: 0, bottom: 0, left: 0 }} />
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
      </React.Fragment>
    </Flow>
  );
};

export default Edit;
