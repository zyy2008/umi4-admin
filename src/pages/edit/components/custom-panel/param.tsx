import React from "react";
import { NsGraph } from "@antv/xflow-core";
import type { IConfigRenderOptions } from "@/components/flow";
import { CardList, CardListProps } from "@/components/flow-custom";
import { APIS } from "@/services";
import { useRequest, useModel } from "@umijs/max";

const Param: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const { initialState } = useModel("@@initialState");
  const { satList = [] } = initialState ?? {};
  const {
    data = [],
    loading,
    run,
  } = useRequest(
    (satId) => APIS.DefaultApi.baseServerDataQueryQueryTmBySidGet({ satId }),
    {
      manual: true,
    }
  );
  const dataSource = React.useMemo<CardListProps["dataSource"]>(() => {
    return data?.map((item) => ({
      ...item,
      id: item.tmCode,
      label: item.tmName,
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

  React.useEffect(() => {
    if (satList?.length > 0) {
      run(satList?.[0]?.pkId);
    }
  }, [satList]);

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
