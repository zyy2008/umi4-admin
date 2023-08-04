import React from "react";
import { ProTable } from "@ant-design/pro-components";
import { Bind, mockMids, mockEvents } from "./components";
import { bindEventSearch } from "./service";
export * from "./service";

export default function () {
  return (
    <ProTable
      request={async () => {
        const data = await bindEventSearch({
          mid: "",
          eventId: "",
          triggerType: [],
          topic: "",
          frequency: [],
          isEffect: 1,
        });
        return {
          data,
          success: true,
        };
      }}
      columns={[
        {
          title: "卫星",
          dataIndex: "mid",
          valueType: "select",
          fieldProps: {
            options: mockMids,
          },
        },
        {
          title: "事件名称",
          dataIndex: "eventName",
          valueType: "select",
          fieldProps: {
            options: mockEvents,
          },
        },
        {
          title: "触发方式",
          dataIndex: "triggerType",
          valueType: "select",
          fieldProps: {
            mode: "multiple",
            options: [
              {
                label: "计划任务",
                value: 1,
              },
              {
                label: "应急任务",
                value: 2,
              },
            ],
          },
        },
        {
          title: "是否生效",
          dataIndex: "isEffect",
          valueType: "select",
          fieldProps: {
            options: [
              {
                label: "生效",
                value: 1,
              },
              {
                label: "不生效",
                value: 2,
              },
            ],
          },
        },
      ]}
      toolBarRender={() => [<Bind key="bind" />]}
    />
  );
}
