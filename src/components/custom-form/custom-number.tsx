import React from "react";
import { Form, InputNumber, Tooltip } from "antd";
import { FormItemWrapper } from "@antv/xflow";
import type { NsJsonSchemaForm } from "@antv/xflow";

// 渲染 FormItem 的 extra 项
export function renderFormItemExtra(title?: string) {
  if (!title) {
    return undefined;
  }
  return <Tooltip title={title} />;
}

export const NumberShape: React.FC<NsJsonSchemaForm.IControlProps> = (
  props
) => {
  const { controlSchema } = props;
  const {
    required,
    tooltip,
    extra,
    name,
    label,
    placeholder,
    originData,
    rules,
  } = controlSchema;

  return (
    <FormItemWrapper schema={controlSchema}>
      {({ hidden, disabled, initialValue }) => {
        return (
          <Form.Item
            name={name}
            label={label}
            initialValue={initialValue}
            tooltip={tooltip}
            extra={renderFormItemExtra(extra)}
            required={required}
            hidden={hidden}
            rules={rules}
          >
            <InputNumber
              {...originData}
              disabled={disabled}
              placeholder={placeholder}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        );
      }}
    </FormItemWrapper>
  );
};
