import React from "react";
import { InputNumber, Tooltip, InputNumberProps } from "antd";
import { FormItemWrapper } from "./index";
import type { NsJsonSchemaForm } from "@antv/xflow";

export const NumberShape: React.FC<NsJsonSchemaForm.IControlProps> = (
  props
) => {
  const { controlSchema } = props;
  const { originData }: { originData?: InputNumberProps } = controlSchema;

  return (
    <FormItemWrapper {...props}>
      {({ disabled, placeholder }) => {
        return (
          <InputNumber
            {...originData}
            disabled={disabled}
            placeholder={placeholder}
            style={{
              width: "100%",
            }}
          />
        );
      }}
    </FormItemWrapper>
  );
};
