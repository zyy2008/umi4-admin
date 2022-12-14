import React from "react";
import type { IConfigRenderOptions } from "@/components/flow";
import { BetaSchemaForm } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRequest } from "@umijs/max";
import { APIS } from "@/services";
import { CardList, CardListProps } from "./index";

const Public: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const { data = [], loading } = useRequest(() => {
    return APIS._Api.kmsZsbjServerApiCommonFunctionListGet({ name: "1" });
  });
  const dataSource = React.useMemo<CardListProps["dataSource"]>(() => {
    return data?.map((item) => ({
      ...item,
      label: item.funName,
      id: item.uuid,
      renderKey: "MultiDocumentNode",
      width: 90,
      height: 60,
    }));
  }, [data]);
  return (
    <CardList
      title="公共函数"
      loading={loading}
      header={
        <BetaSchemaForm
          modalProps={{ destroyOnClose: true }}
          trigger={<Button type="primary">新增</Button>}
          layoutType="ModalForm"
          columns={[
            {
              title: "函数名称",
              dataIndex: "groupState",
              valueType: "text",
              formItemProps: {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
            {
              title: "函数内容",
              dataIndex: "groupState1",
              valueType: "textarea",
              formItemProps: {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
          ]}
        />
      }
      dataSource={dataSource}
      onMouseDown={onMouseDown}
    />
  );
};

export default Public;
