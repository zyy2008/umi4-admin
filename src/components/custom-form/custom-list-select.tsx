import React from "react";
import { FormItemWrapper } from "@antv/xflow";
import type { NsJsonSchemaForm } from "@antv/xflow";
import { Form } from "antd";
import styles from "./styles.less";
import { SelectMids } from "./index";

export const ListSelectShape: React.FC<NsJsonSchemaForm.IControlProps> = (
  props
) => {
  const { controlSchema, form } = props;
  const { name, label, placeholder, originData, required } = controlSchema;
  return (
    <FormItemWrapper schema={controlSchema}>
      {({ initialValue }) => {
        return (
          <Form.List name={name} initialValue={initialValue as any}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    label={index === 0 ? label : ""}
                    required={required}
                    key={field.key}
                    className={styles["form-item"]}
                  >
                    <Form.Item
                      {...field}
                      label={originData?.paramNote?.[index].name}
                      tooltip={originData?.paramNote?.[index].paramNote}
                    >
                      <SelectMids placeholder={placeholder} />
                    </Form.Item>
                  </Form.Item>
                ))}
              </>
            )}
          </Form.List>
        );
      }}
    </FormItemWrapper>
  );
};
