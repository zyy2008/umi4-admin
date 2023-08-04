import React from "react";
import type { IConfigRenderOptions } from "@/components/flow";
import { useRequest } from "@umijs/max";
import { CardList, CardListProps } from "@/components/flow-custom";
import { customEventSearch, Context } from "@/pages/bpmn";
import { uuidv4 } from "@antv/xflow";
import { ports } from "./base";

const Public: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const ctx = React.useContext(Context);
  const {
    data = [],
    loading,
    run,
  } = useRequest(customEventSearch, {
    formatResult: (res) => {
      return res;
    },
  });
  ctx?.event$?.useSubscription((val) => {
    if (val === "public") {
      run();
    }
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
        ports,
      };
    });
  }, [data]);
  return (
    <CardList
      title="已定制流程"
      loading={loading}
      dataSource={dataSource}
      onMouseDown={onMouseDown}
    />
  );
};

export default Public;
