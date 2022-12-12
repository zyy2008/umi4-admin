import React from "react";
import { uuidv4 } from "@antv/xflow";
import type { IConfigRenderOptions } from "@/components/flow";
import { BetaSchemaForm } from "@ant-design/pro-components";
import { Button } from "antd";
import { CardList } from "./index";

const Public: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  return (
    <CardList
      title="公共函数"
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
      dataSource={[
        {
          id: uuidv4(),
          label: "函数组件1",
          renderKey: "MultiDocumentNode",
          width: 90,
          height: 60,
        },
      ]}
      onMouseDown={onMouseDown}
    />
  );
};

export default Public;
