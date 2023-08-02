import React from "react";
import { FormProvider, createSchemaField, FormConsumer } from "@formily/react";
import {
  createForm,
  onFieldValueChange,
  Form as FormHandle,
  Field,
} from "@formily/core";
import {
  Select,
  FormItem,
  ArrayTabs,
  Input,
  FormTab,
  ArrayItems,
  Space,
} from "@formily/antd";

export type ViewHandle = {
  form?: FormHandle;
};

type MidsItem = {
  label?: string;
  value?: any;
};

type IProps = {};
const formTab = FormTab.createFormTab();
const SchemaField = createSchemaField({
  components: {
    Select,
    FormItem,
    ArrayTabs,
    FormTab,
    Input,
    ArrayItems,
    Space,
  },
});

const mockMids: MidsItem[] = [...new Array(10).keys()].map((key) => ({
  label: `卫星${key}`,
  value: `A${key}`,
}));

const Form = React.forwardRef<ViewHandle, IProps>((props, ref) => {
  const [mids, setMids] = React.useState<string[]>([]);
  const form = React.useMemo(
    () =>
      createForm({
        effects() {
          onFieldValueChange("mids", (field) => {
            setMids(field.value);
          });
        },
      }),
    []
  );

  const midsItems = React.useMemo<MidsItem[]>(() => {
    return mockMids.filter(
      (item) => mids.findIndex((value) => value === item.value) > -1
    );
  }, [mids]);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        form: form,
      };
    },
    [form]
  );
  return (
    <FormProvider form={form}>
      <SchemaField>
        <SchemaField.Array
          name="mids"
          title="卫星"
          x-decorator="FormItem"
          x-component="Select"
          enum={mockMids}
          x-component-props={{
            mode: "multiple",
            maxTagCount: 3,
            placeholder: "请选择卫星",
          }}
        />
        <SchemaField.Void
          type="void"
          x-component="FormTab"
          x-component-props={{ formTab }}
          title="222"
        >
          {midsItems?.map((item) => {
            return (
              <SchemaField.Void
                key={item.value}
                type="void"
                name={item.value}
                x-component="FormTab.TabPane"
                x-component-props={{
                  tab: item.label,
                  key: item.value,
                }}
              >
                <SchemaField.String
                  name="aaa"
                  x-decorator="FormItem"
                  title="AAA"
                  required
                  x-component="Input"
                />
              </SchemaField.Void>
            );
          })}
        </SchemaField.Void>
      </SchemaField>
    </FormProvider>
  );
});
export default Form;
