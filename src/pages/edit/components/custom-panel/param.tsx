import React from "react";
import { NsGraph } from "@antv/xflow-core";
import type { IConfigRenderOptions } from "@/components/flow";
import { CardList, CardListProps } from "@/components/flow-custom";
import { APIS } from "@/services";
import { useRequest, useSearchParams, useModel } from "@umijs/max";

const Param: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const { initialState } = useModel("@@initialState");
  const { satList = [] } = initialState ?? {};
  const [satId, setSatId] = React.useState<string>();
  const { data = [], loading } = useRequest(
    () => APIS.DefaultApi.baseServerDataQueryQueryTmBySidGet({ satId }),
    {
      refreshDeps: [satId],
    }
  );
  const dataSource = React.useMemo<CardListProps["dataSource"]>(() => {
    return data?.map((item) => ({
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
      setSatId(satList?.[0]?.pkId as string);
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
