import React from "react";
import { uuidv4 } from "@antv/xflow";
import { NsGraph } from "@antv/xflow-core";
import type { IConfigRenderOptions } from "@/components/flow";
import { CardList, CardListProps } from "./index";
import { APIS } from "@/services";
import { useRequest } from "@umijs/max";

const Param: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const {
    data = [],
    loading,
    error,
  } = useRequest(() => {
    return APIS.DefaultApi.dataQueryQueryTmBySidGet({ satSid: "" });
  });
  const dataSource = React.useMemo<CardListProps["dataSource"]>(() => {
    return data?.map((item) => ({
      ...item,
      id: item.paramCode,
      label: item.paramName,
      renderKey: "ConnectorNode",
      width: 70,
      height: 70,
      ports: [
        {
          type: NsGraph.AnchorType.OUTPUT,
          group: NsGraph.AnchorGroup.BOTTOM,
          tooltip: "输出桩",
        },
      ] as NsGraph.INodeAnchor[],
    }));
  }, [data]);
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <CardList
      loading={loading}
      title="参数"
      dataSource={dataSource}
      onMouseDown={onMouseDown}
    />
  );
};

export default Param;
