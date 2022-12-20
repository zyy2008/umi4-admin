import React from "react";
import { TreeSelectProps } from "antd";
import { MODELS, NsGraph, uuidv4 } from "@antv/xflow";
import { Graph } from "@antv/x6";
import { CheckCardProps } from "@ant-design/pro-components";
import { uniqBy } from "lodash";
import { ViewHandle, CheckListProps, controlShape } from "./components";
import {
  BaseResponseListViewRelationship,
  KnowledgeView,
  ViewRelationship,
} from "@/services";

type IProps = {
  graphData?: NsGraph.IGraphData;
};

type DProps = {
  data: ViewRelationship[];
  selectValue: number[];
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

export const useFileTreeSelect = () => {
  const [value, setValue] = React.useState<number[]>([0, 1, 2, 3]);
  const [data, setData] = React.useState<
    BaseResponseListViewRelationship["data"]
  >([]);
  const onSelectChange = React.useCallback<
    Required<Pick<TreeSelectProps, "onChange">>["onChange"]
  >((val) => {
    setValue(val);
  }, []);
  const onSuccess = React.useCallback<
    (T: BaseResponseListViewRelationship["data"]) => void
  >(setData, []);
  return { value, onSelectChange, data, onSuccess };
};

export const useData = (props: DProps) => {
  const { data, selectValue } = props;
  const selectData = React.useMemo<NsGraph.IGraphData>(() => {
    const list: KnowledgeView[] = [];
    data.forEach((item) => {
      list.push(...[item.child ?? {}, item.parent ?? {}]);
    });
    const dataUniqBy = uniqBy(list, "id");
    const filter = dataUniqBy.filter(({ mark }) => {
      const find = selectValue.findIndex((val) => val === mark);
      return find > -1;
    });
    const nodes: NsGraph.INodeConfig[] = filter.map((item) => {
      return {
        ...item,
        id: String(item.id) || uuidv4(),
        label: item.name,
        fill: controlShape[item.mark ?? 0],
        renderKey: "ConnectorNode",
        width: 70,
        height: 70,
      };
    });
    return {
      nodes,
      edges: [],
    };
  }, [data, selectValue]);
  return { selectData };
};
