import React from "react";
import {
  FormProvider,
  createSchemaField,
  useFormEffects,
  observer,
  useField,
  RecursionField,
  ISchema,
  useForm,
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
  Checkbox,
  SelectTable,
  Radio,
  TimePicker,
} from "@formily/antd";
import { eventISchema, handlerEnum } from "./schema";

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
    Checkbox,
    SelectTable,
    Radio,
    TimePicker,
  },
});

export const mockMids: MidsItem[] = [...new Array(10).keys()].map((key) => ({
  label: `卫星${key}`,
  value: `A${key}`,
}));

export const mockEvents: MidsItem[] = [...new Array(10).keys()].map((key) => ({
  label: `事件${key}`,
  value: `B${key}`,
}));

const EventSetting: React.FC<{
  name: string;
}> = observer(({ name }) => {
  const field = useField();
  const form = useForm();
  const [schema, setSchema] = React.useState<ISchema>({});
  useFormEffects(() => {
    onFieldValueChange(`setting.${name}.events`, (field) => {
      if (field.value.length > 0) {
        const find = mockEvents.filter((item) => {
          const is =
            field.value.findIndex((value: any) => value === item.value) > -1;
          if (!is) {
            form.clearFormGraph(`setting.${name}.setting.${item.value}.*`);
            form.clearFormGraph(`setting.${name}.setting.${item.value}`);
          }
          return is;
        });
        const schema = eventISchema(find);
        setSchema(schema);
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
          onFieldValueChange("mids", (field, form) => {
            mockMids.forEach((item) => {
              const is =
                field.value.findIndex((value: any) => value === item.value) >
                -1;
              if (!is) {
                form.clearFormGraph(`setting.${item.value}.*`);
                form.clearFormGraph(`setting.${item.value}`);
              }
            });
            setMids(field.value);
          });
        },
      }),
    []
  );

  const midsItems = React.useMemo<MidsItem[]>(() => {
    return mockMids.filter((item) => {
      const is = mids.findIndex((value) => value === item.value) > -1;
      return is;
    });
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
      <SchemaField scope={{ formTab, handlerEnum }}>
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
        <SchemaField.Void x-component="FormTab">
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
                      title="事件"
                      x-decorator="FormItem"
                      x-component="Select"
                      enum={mockEvents}
                      required
                      x-component-props={{
                        mode: "multiple",
                        maxTagCount: 3,
                        placeholder: "请选择事件",
                      }}
                    />
                    <SchemaField.Object
                      name="setting"
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
