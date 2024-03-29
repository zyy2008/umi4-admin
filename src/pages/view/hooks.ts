import React from "react";
import { TreeSelectProps } from "antd";
import { MODELS, NsGraph, uuidv4 } from "@antv/xflow";
import { CheckCardProps } from "@ant-design/pro-components";
import { uniqBy } from "lodash";
import {
  RightViewHandle,
  LeftViewHandle,
  CheckListProps,
  controlShape,
} from "./components";
import { KnowledgeView, ViewRelationship, ParamBean, APIS } from "@/services";
import {
  formatGraphData,
  formatTree,
  graphReader,
  graphinReader,
} from "@/utils";
import type { DataNode } from "antd/es/tree";

type IProps = {
  graphData?: NsGraph.IGraphData;
  rightRef: React.RefObject<RightViewHandle>;
};

export type DProps = {
  data: ViewRelationship[];
  selectValue: number[];
  formatData: NsGraph.INodeConfig[];
};

// const worker = new Worker("./edges.worker.js");

export const useView = (props: IProps) => {
  const { graphData, rightRef } = props;
  const [nodesValue, setNodesValue] = React.useState<CheckCardProps["value"]>();
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const onChange = React.useCallback<CheckListProps["onChange"]>(
    async (val, item) => {
      const app = rightRef.current?.app;
      if (app) {
        const x6Graph = await app.getGraphInstance();
        const node = await MODELS.SELECTED_NODE.useValue(app.modelService);
        const data = node.getData();
        const value = val
          ? item
          : { label: "参数", value: "", tmName: "参数", tmCode: "" };
        const { success } = await APIS.DefaultApi.kmsViewServerViewEditorPost({
          id: data.id,
          newName: value?.tmName,
          nodeCode: value?.tmCode,
        });
        if (success) {
          node.setData({
            ...data,
            ...value,
            label: value?.tmName,
          });
          x6Graph.cleanSelection();
          setTimeout(() => {
            x6Graph.select(node);
          }, 20);
        }
      }
    },
    [rightRef.current]
  );
  React.useEffect(() => {
    if (graphData) {
      const { nodes } = graphData;
      const val = nodes
        .filter((item) => item.tmCode)
        .map((item) => item.tmCode);
      setNodesValue(val);
    }
  }, [graphData]);
  return { rightRef, onChange, nodesValue, disabled, setDisabled };
};

export const useFileTreeSelect = () => {
  const [value, setValue] = React.useState<number[]>([0, 1, 2, 3]);
  const [data, setData] = React.useState<ViewRelationship[]>([]);
  const onSelectChange = React.useCallback<
    Required<Pick<TreeSelectProps, "onChange">>["onChange"]
  >(setValue, []);
  const onSuccess = React.useCallback<(T: ViewRelationship[]) => void>(
    setData,
    []
  );
  const formatData = React.useMemo<NsGraph.INodeConfig[]>(() => {
    const list: KnowledgeView[] = [];
    data?.forEach((item) => {
      list.push(...[item.child ?? {}, item.parent ?? {}]);
    });
    const dataUniqBy = uniqBy(list, "id");
    return dataUniqBy.map((item) => ({
      ...item,
      id: `${item.id}` || uuidv4(),
      label: item.name,
      fill: controlShape[item.mark ?? 0],
      renderKey: "ConnectorNode",
      width: 70,
      height: 70,
      ports: ports(item.mark),
    }));
  }, [data]);

  const formatTreeData = React.useMemo<DataNode[]>(() => {
    return formatTree({ data });
  }, [data]);
  return { value, onSelectChange, data, onSuccess, formatData, formatTreeData };
};

const ports: (T: KnowledgeView["mark"]) => NsGraph.INodeAnchor[] = (mark) => {
  switch (mark) {
    case 0:
      return [
        {
          id: uuidv4(),
          type: NsGraph.AnchorType.OUTPUT,
          group: NsGraph.AnchorGroup.BOTTOM,
          tooltip: "输出桩",
        },
      ];
    case 1:
    case 2:
      return [
        {
          id: uuidv4(),
          type: NsGraph.AnchorType.OUTPUT,
          group: NsGraph.AnchorGroup.BOTTOM,
          tooltip: "输出桩",
        },
        {
          id: uuidv4(),
          type: NsGraph.AnchorType.INPUT,
          group: NsGraph.AnchorGroup.TOP,
          tooltip: "输入桩",
        },
      ];
    case 3:
      return [
        {
          id: uuidv4(),
          type: NsGraph.AnchorType.INPUT,
          group: NsGraph.AnchorGroup.TOP,
          tooltip: "输入桩",
        },
      ];
    default:
      return [];
  }
};

export const useData = (props: DProps) => {
  const { data, selectValue, formatData } = props;
  const [selectData, setSelectData] = React.useState<NsGraph.IGraphData>();
  const [graphData, setGraphData] = React.useState<NsGraph.IGraphData>();
  const [custom, setCustom] = React.useState<string[]>([]);
  const leftRef = React.useRef<LeftViewHandle>(null);
  const rightRef = React.useRef<RightViewHandle>(null);
  React.useEffect(() => {
    if (selectValue.length > 0 && formatData.length > 0 && data.length > 0) {
      const nodes = formatData.filter(({ mark }) => {
        const find = selectValue.findIndex((val) => val === mark);
        return find > -1;
      });
      setSelectData(formatGraphData({ data, nodes }));
    }
  }, [data, selectValue, formatData]);
  React.useEffect(() => {
    if (custom.length > 0) {
      const nodes = formatData.filter(({ id }) => {
        const find = custom.findIndex((val) => val === id);
        return find > -1;
      });
      setSelectData(formatGraphData({ data, nodes }));
    }
  }, [custom, formatData, data]);
  React.useEffect(() => {
    if (selectData && rightRef.current) {
      graphReader(selectData, rightRef.current.app);
    }
  }, [selectData, rightRef.current]);

  React.useEffect(() => {
    if (selectData && leftRef.current) {
      graphinReader(selectData, leftRef.current.app);
    }
  }, [selectData, leftRef.current]);

  return {
    selectData,
    onOk: setCustom,
    graphData,
    setGraphData,
    leftRef,
    rightRef,
  };
};

export const useParams = () => {
  const [params, setParams] = React.useState<ParamBean[]>([]);
  return {
    params,
    setParams,
  };
};
