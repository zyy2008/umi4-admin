import React from "react";
import { Select, Form, Space } from "antd";
import { useRequest } from "@umijs/max";
import { APIS } from "@/services";

const Object = () => {
  const { data, loading } = useRequest(() =>
    APIS.DefaultApi.baseServerDataQueryQueryObjectGroupListGet()
  );
  return (
    <Space size={0}>
      <span>对象代号：</span>
      <Select
        style={{ width: 100 }}
        placeholder="请选择对象代号"
        loading={loading}
        options={data?.map(({ objectCode, objectName }) => ({
          labe: objectName,
          value: objectCode,
        }))}
      />
    </Space>
  );
};

export default Object;
