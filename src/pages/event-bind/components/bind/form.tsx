import React from "react";
import {
  FormProvider,
  createSchemaField,
  useFormEffects,
  observer,
  useField,
  RecursionField,
  ISchema,
} from "@formily/react";
import {
  createForm,
  onFieldValueChange,
  Form as FormHandle,
} from "@formily/core";
import {
  Select,
  FormItem,
  ArrayTabs,
  Input,
  FormTab,
  ArrayItems,
  Space,
  FormCollapse,
} from "@formily/antd";
import { eventISchema } from "./schema";

export type ViewHandle = {
  form?: FormHandle;
};

type MidsItem = {
  label?: string;
  value?: any;
};

type IProps = {};

const formTab = FormTab.createFormTab();
// const formCollapse = FormCollapse.createFormCollapse();
const SchemaField = createSchemaField({
  components: {
    Select,
    FormItem,
    ArrayTabs,
    FormTab,
    Input,
    ArrayItems,
    Space,
    FormCollapse,
  },
});

const mockMids: MidsItem[] = [...new Array(10).keys()].map((key) => ({
  label: `卫星${key}`,
  value: `A${key}`,
}));

const mockEvents: MidsItem[] = [...new Array(10).keys()].map((key) => ({
  label: `事件${key}`,
  value: `B${key}`,
}));

const EventSetting: React.FC<{
  name: string;
}> = observer(({ name }) => {
  const field = useField();
  const [schema, setSchema] = React.useState<ISchema>({});
  useFormEffects(() => {
    onFieldValueChange(`setting.${name}.events`, (field) => {
      if (field.value.length > 0) {
        setSchema(eventISchema);
      } else {
        setSchema({});
      }
    });
  });

  return (
    <RecursionField
      basePath={field.address}
      schema={schema}
      onlyRenderProperties
    />
  );
});

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
          required
          x-component-props={{
            mode: "multiple",
            maxTagCount: 3,
            placeholder: "请选择卫星",
          }}
        />
        <SchemaField.Void x-component="FormTab" x-component-props={{ formTab }}>
          {midsItems?.map((item) => {
            return (
              <SchemaField.Void
                key={item.value}
                name={item.value}
                x-component="FormTab.TabPane"
                x-component-props={{
                  tab: item.label,
                  key: item.value,
                }}
              >
                <SchemaField.Object name="setting">
                  <SchemaField.Object name={item.value}>
                    <SchemaField.Array
                      name="events"
                      title="选择事件"
                      x-decorator="FormItem"
                      x-component="Select"
                      enum={mockEvents}
                      required
                      x-component-props={{
                        mode: "multiple",
                        maxTagCount: 3,
                        placeholder: "请选择卫星",
                      }}
                    />
                    <SchemaField.Object
                      name="ddd"
                      x-decorator="FormItem"
                      x-component={() => <EventSetting name={item.value} />}
                    ></SchemaField.Object>
                  </SchemaField.Object>
                </SchemaField.Object>
              </SchemaField.Void>
            );
          })}
        </SchemaField.Void>
      </SchemaField>
    </FormProvider>
  );
});
export default Form;
