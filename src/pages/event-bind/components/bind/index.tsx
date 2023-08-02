import React from "react";
import { Button, Modal } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { FormProvider, createSchemaField, ISchema } from "@formily/react";
import { createForm } from "@formily/core";
import { Select, FormItem, ArrayTabs, Input } from "@formily/antd";

type IProps = {};

const form = createForm();
const SchemaField = createSchemaField({
  components: {
    Select,
    FormItem,
    ArrayTabs,
    Input,
  },
});

const schema: ISchema = {
  type: "object",
  properties: {
    mids: {
      type: "array",
      title: "关联卫星",
      enum: [...new Array(10).keys()].map((key) => ({
        label: `卫星${key}`,
        value: key,
      })),
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-component-props": {
        placeholder: "请选择",
        mode: "multiple",
        maxTagCount: 3,
      },
    },
    array: {
      type: "array",
      title: "配置",
      "x-decorator": "FormItem",
      maxItems: 3,
      "x-component": "ArrayTabs",
      items: {
        type: "object",
        properties: {
          aaa: {
            type: "string",
            "x-decorator": "FormItem",
            title: "AAA",
            required: true,
            "x-component": "Input",
          },
          bbb: {
            type: "string",
            "x-decorator": "FormItem",
            title: "BBB",
            required: true,
            "x-component": "Input",
          },
        },
      },
    },
  },
};

const Bind: React.FC<IProps> = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <React.Fragment>
      <Button
        type="primary"
        icon={<SwapOutlined />}
        onClick={() => setOpen(true)}
      >
        绑定
      </Button>
      <Modal
        open={open}
        title="卫星事件绑定"
        onOk={() => {
          form.submit().then((res) => {
            console.log(res);
          });
        }}
      >
        <FormProvider form={form}>
          <SchemaField schema={schema} />
        </FormProvider>
      </Modal>
    </React.Fragment>
  );
};

export default Bind;
