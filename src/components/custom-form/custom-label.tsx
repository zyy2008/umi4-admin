import React from "react";
import { FormItemWrapper } from "@antv/xflow";
import type { NsJsonSchemaForm } from "@antv/xflow";
import { Form } from "antd";

export const LabelShape: React.FC<NsJsonSchemaForm.IControlProps> = (props) => {
  const { controlSchema } = props;
  const { required, tooltip, extra, name, label } = controlSchema;
  return (
    <FormItemWrapper schema={controlSchema}>
      {({ hidden, initialValue }) => {
        return (
          <Form.Item
            label={label}
            initialValue={initialValue}
            tooltip={tooltip}
            extra={extra}
            required={required}
            hidden={hidden}
          >
            {name}
          </Form.Item>
        );
      }}
    </FormItemWrapper>
  );
};
