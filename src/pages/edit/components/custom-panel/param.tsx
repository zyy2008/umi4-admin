import React from "react";
import { NsGraph } from "@antv/xflow-core";
import type { IConfigRenderOptions } from "@/components/flow";
import { CardList, CardListProps } from "@/components/flow-custom";
import { useModel } from "@umijs/max";
import { Card, Select } from "antd";
import { Context } from "@/pages/edit";

const Param: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const { initialState } = useModel("@@initialState");
  const { satList = [] } = initialState ?? {};
  const [value, setValue] = React.useState<number>();
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
      }));
    }
    return [];
  }, [ctx?.params]);

  React.useEffect(() => {
    if (value) {
      ctx?.getParams(value);
    }
  }, [value]);

  React.useEffect(() => {
    if (satList?.length > 0) {
      setValue(satList?.[0]?.pkId);
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
            value={value}
            options={satList.map((item) => {
              return {
                value: item.pkId,
                label: item.value,
              };
            })}
            onChange={setValue}
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
