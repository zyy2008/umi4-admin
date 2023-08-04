import React from "react";
import { uuidv4 } from "@antv/xflow";
import type { IConfigRenderOptions } from "@/components/flow";
import { useRequest } from "@umijs/max";
import { CardList, CardListProps } from "@/components/flow-custom";
import { eventToolsSearch, Context } from "@/pages/bpmn";
import { ports } from "./base";

const Event: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const ctx = React.useContext(Context);
  const {
    data = [],
    loading,
    run,
  } = useRequest(eventToolsSearch, {
    formatResult: (res) => {
      return res;
    },
  });
  ctx?.event$?.useSubscription((val) => {
    if (val === "event") {
      run();
    }
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
        ports,
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
