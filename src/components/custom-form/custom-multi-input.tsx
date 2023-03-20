import React from "react";
import { FormItemWrapper } from "@antv/xflow";
import type { NsJsonSchemaForm } from "@antv/xflow";
import { Form, Select, Space, Input } from "antd";
import styles from "./styles.less";
import { SelectMulti } from "./index";

type Value = {
  status: "text" | "select";
  fieldValue: string | undefined;
};

type MultiInputProps = {
  value?: Value;
  onChange?: (T: Value) => void;
};

const MultiInput: React.FC<MultiInputProps> = (props) => {
  const { value, onChange } = props;
  const { status, fieldValue } = value ?? {
    status: "text",
    fieldValue: undefined,
  };
  return (
    <Space
      size={0}
      style={{
        width: "100%",
      }}
      className={styles["multi-item"]}
    >
      <Select
        options={[
          {
            label: "输入",
            value: "text",
          },
          {
            label: "选择",
            value: "select",
          },
        ]}
        value={status}
        onChange={(val) => {
          onChange?.({
            fieldValue: undefined,
            status: val,
          });
        }}
        className={styles["multi-addon"]}
      />
      {status === "text" ? (
        <Input
          value={fieldValue}
          onChange={({ target: { value } }) => {
            onChange?.({
              fieldValue: value,
              status,
            });
          }}
          placeholder="请输入"
        />
      ) : (
        <SelectMulti
          value={fieldValue}
          onChange={(value) => {
            onChange?.({
              fieldValue: value,
              status,
            });
          }}
        />
      )}
    </Space>
  );
};

export const MultiInputShape: React.FC<NsJsonSchemaForm.IControlProps> = (
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
                      <MultiInput />
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
