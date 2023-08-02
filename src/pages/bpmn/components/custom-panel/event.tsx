import React from "react";
import { uuidv4 } from "@antv/xflow";
import type { IConfigRenderOptions } from "@/components/flow";
import { useRequest } from "@umijs/max";
import { CardList, CardListProps } from "@/components/flow-custom";
import { eventToolsSearch } from "@/pages/bpmn/service";

const Event: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const { data = [], loading } = useRequest(eventToolsSearch, {
    formatResult: (res) => {
      return res;
    },
  });
  const dataSource = React.useMemo<CardListProps["dataSource"]>(() => {
    return data?.map((item) => {
      const { toolName, toolId, toolData } = item;
      const others = JSON.parse(toolData as string);
      return {
        id: toolId,
        label: toolName,
        renderKey: "ToolNode",
        width: 100,
        height: 70,
        ...others,
      };
    });
  }, [data]);
  return (
    <CardList
      loading={loading}
      title="事件工具"
      dataSource={dataSource}
      onMouseDown={onMouseDown}
    />
  );
};

export default Event;
