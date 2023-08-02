import React from "react";
import { ProTable } from "@ant-design/pro-components";
import { Bind } from "./components";

export default function () {
  return (
    <ProTable
      columns={[
        { title: "卫星", dataIndex: "mid" },
        { title: "事件名称", dataIndex: "eventName" },
        { title: "触发方式", dataIndex: "tag" },
        { title: "是否生效", dataIndex: "is" },
      ]}
      toolBarRender={() => [<Bind key="bind" />]}
    />
  );
}
