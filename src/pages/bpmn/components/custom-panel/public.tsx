import React from "react";
import type { IConfigRenderOptions } from "@/components/flow";
import { useRequest } from "@umijs/max";
import { CardList, CardListProps } from "@/components/flow-custom";
import { customEventSearch } from "@/pages/bpmn/service";
import { uuidv4 } from "@antv/xflow";

const Public: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const {
    data = [],
    loading,
    run,
  } = useRequest(customEventSearch, {
    formatResult: (res) => {
      return res;
    },
  });
  const dataSource = React.useMemo<CardListProps["dataSource"]>(() => {
    return data?.map((item) => {
      const { eventName, eventId } = item;
      return {
        label: eventName,
        id: eventId ?? uuidv4(),
        renderKey: "EventNode",
        width: 100,
        height: 70,
      };
    });
  }, [data]);
  return (
    <CardList
      title="已定制事件"
      loading={loading}
      dataSource={dataSource}
      onMouseDown={onMouseDown}
    />
  );
};

export default Public;
