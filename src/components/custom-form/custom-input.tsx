import React from "react";
import { Input } from "antd";
import { FormItemWrapper } from "./index";
import type { NsJsonSchemaForm } from "@antv/xflow";

export const InputShape: React.FC<NsJsonSchemaForm.IControlProps> = (props) => {
  return (
    <FormItemWrapper {...props}>
      {({ disabled, placeholder }) => (
        <Input placeholder={placeholder} disabled={disabled} />
      )}
    </FormItemWrapper>
  );
};
