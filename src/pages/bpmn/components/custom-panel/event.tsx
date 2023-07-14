import React from "react";
import { uuidv4 } from "@antv/xflow";
import type { IConfigRenderOptions } from "@/components/flow";
import { useRequest } from "@umijs/max";
import { CardList, CardListProps } from "@/components/flow-custom";
import { APIS } from "@/services";

const Event: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const { data = [], loading } = useRequest(() =>
    APIS.DefaultApi.kmsZsbjServerApiKnowledgeListHasReturnGet()
  );
  const dataSource = React.useMemo<CardListProps["dataSource"]>(() => {
    return data?.map((item) => ({
      ...item,
      id: uuidv4(),
      label: item.ruleName,
      renderKey: "RectNode",
      width: 110,
      height: 50,
    }));
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
