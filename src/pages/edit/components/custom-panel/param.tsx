import React from "react";
import { NsGraph } from "@antv/xflow-core";
import type { IConfigRenderOptions } from "@/components/flow";
import { CardList, CardListProps } from "@/components/flow-custom";
import { APIS } from "@/services";
import { useRequest, useSearchParams } from "@umijs/max";

const Param: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const [searchParams] = useSearchParams();
  const [satId, setSatId] = React.useState<string>("SAT1");
  const { data = [], loading } = useRequest(
    () => APIS.DefaultApi.baseServerDataQueryQueryTmBySidGet({ satId }),
    {
      refreshDeps: [satId],
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
    const object = searchParams.get("object");
    let format: any;
    try {
      format = JSON.parse(object ?? "");
    } catch (error) {
      format = { satId: "10" };
      console.error("地址传参格式异常，请检查！");
    }
    format?.satId && setSatId(format?.satId);
  }, []);

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
