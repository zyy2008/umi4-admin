import { ISchema } from "@formily/react";

export const eventISchema: ISchema = {
  type: "void",
  properties: {
    aa: {
      type: "string",
      title: "AA",
      required: true,
      "x-decorator": "FormItem",
      "x-component": "Input",
      "x-component-props": {
        placeholder: "Input",
      },
    },
  },
};
