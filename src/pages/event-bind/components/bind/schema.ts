import { ISchema } from "@formily/react";

type Item = {
  label?: string;
  value?: any;
};

const weekData: string[] = [
  "周一",
  "周二",
  "周三",
  "周四",
  "周五",
  "周六",
  "周日",
];

export const handlerEnum: (T: any, S: any) => Item[] = ($deps, $self) => {
  $self.value = undefined;
  if ($deps[0] === "week") {
    return weekData.map((val) => ({
      label: val,
      value: val,
    }));
  } else {
    return [...new Array(31).keys()].map((key) => ({
      label: `${key + 1}号`,
      value: `${key + 1}号`,
    }));
  }
};

export const eventISchema: (T: Item[]) => ISchema = (val) => {
  const properties = val.map(({ label, value }) => {
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
                    default: "week",
                    enum: [
                      {
                        label: "周",
                        value: "week",
                      },
                      {
                        label: "月",
                        value: "month",
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    "x-component-props": {
                      optionType: "button",
                      buttonStyle: "solid",
                      style: {
                        width: "100px",
                      },
                    },
                    required: true,
                  },
                  num: {
                    type: "string",
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    required: true,
                    "x-component-props": {
                      placeholder: "请选择",
                      style: {
                        width: "159px",
                      },
                    },
                    "x-reactions": {
                      dependencies: [".type"],
                      fulfill: {
                        schema: {
                          enum: "{{handlerEnum($deps,$self)}}",
                        },
                      },
                    },
                  },
                  time: {
                    type: "string",
                    "x-decorator": "FormItem",
                    "x-component": "TimePicker",
                    required: true,
                    "x-component-props": {
                      style: {
                        width: "160px",
                      },
                    },
                  },
                },
              },
              topic: {
                type: "array",
                title: "规则(应急任务)",
                required: true,
                enum: [
                  { label: "规则1", value: "1" },
                  { label: "规则2", value: "2" },
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
