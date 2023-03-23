import React from "react";
import { FormItemWrapper } from "./index";
import type { NsJsonSchemaForm } from "@antv/xflow";

export const LabelShape: React.FC<NsJsonSchemaForm.IControlProps> = (props) => {
  const { controlSchema } = props;
  const { name } = controlSchema;
  return (
    <FormItemWrapper {...props}>
      {() => {
        return <> {name}</>;
      }}
    </FormItemWrapper>
  );
};
