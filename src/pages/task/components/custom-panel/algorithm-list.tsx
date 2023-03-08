import React from "react";
import type { IConfigRenderOptions } from "@/components/flow";
import { CardListProps, CardList } from "@/components/flow-custom";
import { useRequest } from "@umijs/max";
import { APIS } from "@/services";
import { uuidv4 } from "@antv/xflow";
import { ports } from "./index";

const AlgorithmList: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const { data = {}, loading } = useRequest(() =>
    APIS.DefaultApi.kmsJobServerAlgorithmListPost(
      { pageNum: "1", pageSize: "100" },
      { algorithmName: "", id: "" }
    )
  );
  const filterData = React.useMemo<CardListProps["dataSource"]>(() => {
    return (data?.records ?? []).map((item) => ({
      data: item,
      nodeType: "ALGORITHM",
      id: uuidv4(),
      label: item.algorithmName,
      renderKey: "RectNode",
      width: 110,
      height: 45,
      ports,
    }));
  }, [data]);
  return (
    <CardList
      title="算法"
      height={200}
      dataSource={filterData}
      onMouseDown={onMouseDown}
      loading={loading}
    />
  );
};

export default AlgorithmList;
