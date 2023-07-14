import React from "react";
import { Input } from "antd";
import { useRequest } from "@umijs/max";
import { APIS } from "@/services";
import { Context } from "../index";

const CheckCode = () => {
  const ctx = React.useContext(Context);
  const { data } = useRequest(
    () =>
      APIS.DefaultApi.kmsZsbjServerApiKnowledgeViewGet({
        uuid: "",
        version: "",
        ...ctx?.state,
      }),
    {
      refreshDeps: [ctx?.state],
    }
  );

  return <Input.TextArea value={data?.expression} />;
};

export default CheckCode;
