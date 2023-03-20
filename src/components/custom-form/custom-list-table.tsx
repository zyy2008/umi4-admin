import React from "react";
import { FormItemWrapper } from "@antv/xflow";
import type { NsJsonSchemaForm } from "@antv/xflow";
import { Form, Button, Input, Select } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import styles from "./styles.less";
import { SelectMids } from "./index";

export const ListTableShape: React.FC<NsJsonSchemaForm.IControlProps> = (
  props
) => {
  const { controlSchema, form } = props;
  const { name, label, placeholder } = controlSchema;
  return (
    <FormItemWrapper schema={controlSchema}>
      {({ initialValue }) => {
        return (
          <Form.List name={name} initialValue={initialValue as any}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => {
                  return (
                    <Form.Item
                      label={index === 0 ? label : ""}
                      required={false}
                      key={field.key}
                      className={styles["form-columns"]}
                    >
                      <Form.Item
                        name={[field.name, "type"]}
                        noStyle={index != 0}
                        label="类型"
                        required
                      >
                        <Select
                          placeholder="请选择"
                          options={[
                            {
                              title: "int",
                              value: "int",
                            },
                            {
                              title: "float",
                              value: "float",
                            },
                            {
                              title: "string",
                              value: "string",
                            },
                            {
                              title: "boolean",
                              value: "boolean",
                            },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "name"]}
                        noStyle={index != 0}
                        label="名称"
                        required
                      >
                        <Input placeholder={placeholder} />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "value"]}
                        noStyle={index != 0}
                        label="值"
                        required
                      >
                        <SelectMids
                          placeholder="请选择"
                          showSearch
                          filterOption={(input, option) =>
                            ((option?.label ?? "") as string)
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        />
                      </Form.Item>
                      <Button
                        type="link"
                        icon={<MinusCircleOutlined />}
                        disabled={!(index === fields.length - 1)}
                        onClick={() => {
                          const values = form.getFieldValue(`${name}`);
                          form.setFieldValue(
                            `${name}`,
                            values.filter((_: string, i: number) => i != index)
                          );
                          setTimeout(() => {
                            remove(index);
                          }, 0);
                        }}
                      />
                    </Form.Item>
                  );
                })}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()}>
                    增加输入
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
