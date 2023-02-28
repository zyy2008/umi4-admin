import React from "react";
import { FormItemWrapper } from "@antv/xflow";
import type { NsJsonSchemaForm } from "@antv/xflow";
import { Form, Select, SelectProps } from "antd";
import { useModel } from "@umijs/max";
import styles from "./styles.less";
import { Context } from "@/pages/edit";

export const SelectListShape: React.FC<NsJsonSchemaForm.IControlProps> = (
  props
) => {
  const { controlSchema, form } = props;
  const ctx = React.useContext(Context);
  const { name, label, placeholder, originData, required } = controlSchema;
  // const labels = React.useMemo<string[]>(() => {
  //   if (originData?.paramNote) {
  //     return originData?.paramNote.map((item: any) => item.name);
  //   }
  //   return [];
  // }, [originData?.paramNote]);
  const options = React.useMemo<SelectProps["options"]>(() => {
    if (ctx?.params) {
      return ctx?.params?.map((item) => ({
        label: item.tmName,
        value: item.tmCode,
      }));
    }
    return [];
  }, [ctx?.params]);
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
                      <Select placeholder={placeholder} options={options} />
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
