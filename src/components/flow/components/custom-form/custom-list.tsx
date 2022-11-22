import React from "react";
import { FormItemWrapper } from "@antv/xflow";
import type { NsJsonSchemaForm } from "@antv/xflow";
import { Form, Button, Input } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import styles from "./styles.less";

export const FormListShape: React.FC<NsJsonSchemaForm.IControlProps> = (
  props
) => {
  const { controlSchema, form } = props;
  const { name, label, placeholder } = controlSchema;
  return (
    <FormItemWrapper schema={controlSchema}>
      {({ initialValue }) => {
        return (
          <Form.List name={name} initialValue={initialValue as any}>
            {(fields, { add }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    label={index === 0 ? label : ""}
                    required={false}
                    key={field.key}
                    className={styles["form-item"]}
                  >
                    <Form.Item {...field} noStyle style={{ display: "flex" }}>
                      <Input placeholder={placeholder} />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => {
                        const values = form.getFieldValue(`${name}`);
                        form.setFieldValue(
                          `${name}`,
                          values.filter((_: string, i: number) => i != index)
                        );
                      }}
                    />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()}>
                    增加条件
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        );
      }}
    </FormItemWrapper>
  );
};
