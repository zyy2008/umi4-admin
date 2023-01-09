import React from "react";
import { Form, Select as ASelect, Tooltip } from "antd";
import { FormItemWrapper } from "@antv/xflow";
import type { NsJsonSchemaForm } from "@antv/xflow";

// 渲染 FormItem 的 extra 项
export function renderFormItemExtra(title?: string) {
  if (!title) {
    return undefined;
  }
  return <Tooltip title={title} />;
}

export const TagsShape: React.FC<NsJsonSchemaForm.IControlProps> = (props) => {
  const { controlSchema } = props;
  const {
    required,
    tooltip,
    extra,
    name,
    label,
    placeholder,
    options = [],
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
            <ASelect disabled={disabled} placeholder={placeholder} mode="tags">
              {options.map((option) => {
                const { title, value } = option;
                return (
                  <ASelect.Option key={value.toString()} value={value as any}>
                    {title}
                  </ASelect.Option>
                );
              })}
            </ASelect>
          </Form.Item>
        );
      }}
    </FormItemWrapper>
  );
};
