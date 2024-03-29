import React from "react";
import { NsGraph } from "@antv/xflow-core";
import type { IConfigRenderOptions } from "@/components/flow";
import { CardList, CardListProps } from "@/components/flow-custom";
import { useModel } from "@umijs/max";
import { Card, Select } from "antd";
import { Context } from "@/pages/edit";

type Option = {
  label: string;
  value?: string | number | null;
};

const Param: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const { initialState } = useModel("@@initialState");
  const { satList = [] } = initialState ?? {};
  const [option, setOption] = React.useState<Option>({
    label: "",
    value: null,
  });
  const ctx = React.useContext(Context);
  const dataSource = React.useMemo<CardListProps["dataSource"]>(() => {
    if (ctx?.params) {
      return ctx?.params?.map((item) => ({
        ...item,
        id: item.tmCode,
        label: item.tmName,
        renderKey: "ConnectorNode",
        width: 70,
        height: 70,
        name: item?.tmCode.toUpperCase(),
      }));
    }
    return [];
  }, [ctx?.params, option.label]);

  React.useEffect(() => {
    if (option.value) {
      ctx?.getParams(option);
    }
  }, [option.value]);

  React.useEffect(() => {
    if (satList?.length > 0) {
      setOption({
        value: 256,
        label: "WX-321",
      });
    }
  }, [satList]);

  return (
    <Card
      size="small"
      title={
        <div className="node-title">
          <span> 卫星</span>
          <Select
            placeholder="请选择卫星"
            style={{ flex: 1, margin: "0 5px" }}
            value={option.value}
            options={satList.map((item) => {
              return {
                value: item.pkId,
                label: item.value,
              };
            })}
            onChange={(_, option) => {
              setOption(option as Option);
            }}
          />
        </div>
      }
      bodyStyle={{ padding: 0 }}
      headStyle={{ padding: 0 }}
    >
      <CardList
        loading={ctx?.paramsLoading}
        title="参数"
        dataSource={dataSource}
        onMouseDown={onMouseDown}
      />
    </Card>
  );
};

export default Param;
