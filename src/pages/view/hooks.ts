import React from "react";
import { MODELS, NsGraph } from "@antv/xflow";
import { Graph } from "@antv/x6";
import { CheckCardProps } from "@ant-design/pro-components";
import { ViewHandle, CheckListProps } from "./components";

type IProps = {
  graphData?: NsGraph.IGraphData;
};

export const useView = (props: IProps) => {
  const { graphData } = props;
  const [x6Graph, setX6Graph] = React.useState<Graph>();
  const [nodesValue, setNodesValue] = React.useState<CheckCardProps["value"]>();
  const rightRef = React.useRef<ViewHandle>(null);
  const onChange = React.useCallback<CheckListProps["onChange"]>(
    async (val, item) => {
      const app = rightRef.current?.app;
      if (app) {
        const x6Graph = await app.getGraphInstance();
        const node = await MODELS.SELECTED_NODE.useValue(app.modelService);
        const data = node.getData();
        const value = val ? item : { label: "参数", value: "" };
        node.setData({
          ...data,
          ...value,
        });
        x6Graph.cleanSelection();
        setTimeout(() => {
          x6Graph.select(node);
        }, 20);
      }
    },
    [rightRef.current]
  );
  React.useEffect(() => {
    if (graphData) {
      const { nodes } = graphData;
      const val = nodes.filter((item) => item.value).map((item) => item.value);
      setNodesValue(val);
    }
  }, [graphData]);
  React.useEffect(() => {
    (async () => {
      if (rightRef.current) {
        const { app } = rightRef.current;
        if (app) {
          const x6Graph = await app?.getGraphInstance();
          setX6Graph(x6Graph);
        }
      }
    })();
  }, [rightRef.current]);
  return { rightRef, onChange, nodesValue, x6Graph };
};
