import React from "react";
import { Input as AInput, InputProps, Button } from "antd";
import type { NsJsonSchemaForm } from "@antv/xflow";
import { FormItemWrapper } from "./index";

type IProps = {
  onClick?: (T: { value?: string; onChange?: InputProps["onChange"] }) => void;
};

const InputButton: React.FC<
  Pick<InputProps, "onChange" | "value" | "disabled" | "placeholder"> & IProps
> = (props) => {
  const { onClick, value: val, onChange, ...others } = props;
  const [value, setValue] = React.useState<any>("");
  React.useEffect(() => {
    setValue(val);
  }, [val]);
  return (
    <div style={{ width: "100%", display: "flex" }}>
      <AInput
        {...others}
        style={{ flex: 1 }}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <Button type="primary" onClick={() => onClick?.({ value, onChange })}>
        保存
      </Button>
    </div>
  );
};

export const SaveShape: React.FC<NsJsonSchemaForm.IControlProps> = (props) => {
  const { controlSchema } = props;
  const { onClick }: NsJsonSchemaForm.IControlProps["controlSchema"] & IProps =
    controlSchema;

  return (
    <FormItemWrapper {...props}>
      {({ disabled, placeholder }) => {
        return (
          <InputButton
            disabled={disabled}
            placeholder={placeholder}
            onClick={onClick}
          />
        );
      }}
    </FormItemWrapper>
  );
};
