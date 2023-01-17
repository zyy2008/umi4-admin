import React from "react";
import { Form, Input as AInput, Tooltip, InputProps, Button } from "antd";
import { FormItemWrapper } from "@antv/xflow";
import type { NsJsonSchemaForm } from "@antv/xflow";

type IProps = {
  onClick?: (T: { value?: string; onChange?: InputProps["onChange"] }) => void;
};

// 渲染 FormItem 的 extra 项
export function renderFormItemExtra(title?: string) {
  if (!title) {
    return undefined;
  }
  return <Tooltip title={title} />;
}

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
  const { controlSchema, form } = props;
  const {
    required,
    tooltip,
    extra,
    name,
    label,
    placeholder,
    rules,
    onClick,
  }: NsJsonSchemaForm.IControlProps["controlSchema"] & IProps = controlSchema;

  return (
    <FormItemWrapper schema={controlSchema}>
      {({ hidden, disabled, initialValue }) => {
        return (
          <Form.Item
            name={name}
            label={label}
            initialValue={initialValue}
            tooltip={tooltip}
            extra={renderFormItemExtra(extra)}
            required={required}
            hidden={hidden}
            rules={rules}
          >
            <InputButton
              disabled={disabled}
              placeholder={placeholder}
              onClick={onClick}
            />
          </Form.Item>
        );
      }}
    </FormItemWrapper>
  );
};
