import React from "react";
import { Select as ASelect, SelectProps } from "antd";
import { FormItemWrapper } from "./index";
import type { NsJsonSchemaForm } from "@antv/xflow";

export const SelectShape: React.FC<NsJsonSchemaForm.IControlProps> = (
  props
) => {
  const { controlSchema } = props;
  const { originData }: { originData?: SelectProps } = controlSchema;

  return (
    <FormItemWrapper {...props}>
      {({ disabled, options, placeholder }) => (
        <ASelect {...originData} disabled={disabled} placeholder={placeholder}>
          {options?.map((option) => {
            const { title, value } = option;
            return (
              <ASelect.Option key={value.toString()} value={value as any}>
                {title}
              </ASelect.Option>
            );
          })}
        </ASelect>
      )}
    </FormItemWrapper>
  );
};
