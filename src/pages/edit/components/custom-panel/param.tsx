import React from "react";
import { NsGraph } from "@antv/xflow-core";
import type { IConfigRenderOptions } from "@/components/flow";
import { CardList, CardListProps } from "@/components/flow-custom";
import { APIS } from "@/services";
import { useRequest, useSearchParams } from "@umijs/max";

const Param: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const [searchParams] = useSearchParams();
  const [satSid, setSatSid] = React.useState<string>("SAT1");
  const { data = [], loading } = useRequest(
    () => APIS.DefaultApi.baseServerDataQueryQueryTmBySidGet({ satSid }),
    {
      refreshDeps: [satSid],
    }
  );
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

  React.useEffect(() => {
    const object = searchParams.get("object");
    let format: any;
    try {
      format = JSON.parse(object ?? "");
    } catch (error) {
      format = { satSid: "SAT1" };
      console.error("地址传参格式异常，请检查！");
    }
    format?.satSid && setSatSid(format?.satSid);
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
