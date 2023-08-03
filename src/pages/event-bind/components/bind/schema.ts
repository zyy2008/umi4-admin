import { ISchema } from "@formily/react";

type Item = {
  label?: string;
  value?: any;
};

export const eventISchema: (T: Item[]) => ISchema = (val) => {
  const properties = val.map(({ label, value }, index) => {
    return [
      value,
      {
        type: "void",
        "x-component": "FormTab.TabPane",
        "x-component-props": {
          tab: label,
        },
        properties: {
          [value]: {
            type: "object",
            properties: {
              triggerType: {
                type: "array",
                title: "触发方式",
                required: true,
                enum: [
                  {
                    label: "计划任务",
                    value: 1,
                  },
                  {
                    label: "应急任务",
                    value: 2,
                  },
                ],
                "x-decorator": "FormItem",
                "x-component": "Checkbox.Group",
              },
              frequency: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "Space",
                "x-reactions": {
                  dependencies: [".triggerType"],
                  fulfill: {
                    schema: {
                      "x-visible": "{{$deps[0].includes(1)}}",
                    },
                  },
                },
                properties: {
                  type: {
                    title: "频次(计划任务)",
                    type: "string",
                    "x-decorator": "FormItem",
                    "x-component": "Input",
                    required: true,
                  },
                  num: {
                    type: "string",
                    "x-decorator": "FormItem",
                    "x-component": "Input",
                    required: true,
                  },
                  time: {
                    type: "string",
                    "x-decorator": "FormItem",
                    "x-component": "Input",
                    required: true,
                  },
                },
              },
              topic: {
                type: "array",
                title: "规则(应急任务)",
                required: true,
                enum: [
                  { label: "规则1", value: 1 },
                  { label: "规则2", value: 2 },
                ],
                "x-decorator": "FormItem",
                "x-component": "Select",
                "x-reactions": {
                  dependencies: [".triggerType"],
                  fulfill: {
                    schema: {
                      "x-visible": "{{$deps[0].includes(2)}}",
                    },
                  },
                },
                "x-component-props": {
                  placeholder: "请选择规则",
                },
              },
            },
          },
        },
      },
    ];
  });
  return {
    type: "object",
    properties: {
      collapse: {
        type: "void",
        "x-component": "FormTab",
        "x-component-props": {
          formTab: "{{formTab}}",
        },
        properties: Object.fromEntries(properties),
      },
    },
  };
};
