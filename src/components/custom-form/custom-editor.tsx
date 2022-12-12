import React from "react";
import type { NsJsonSchemaForm } from "@antv/xflow";
import { FormItemWrapper } from "@antv/xflow";
import {
  Form,
  Input,
  Dropdown,
  Button,
  Space,
  Menu,
  Card,
  Divider,
  MenuProps,
} from "antd";
import insertTextAtCursor from "insert-text-at-cursor";

const tags: string[] = ["+", "-", "*", "/"];

const items: MenuProps["items"] = [
  { label: "菜单项一", key: "item-1" }, // 菜单项务必填写 key
  { label: "菜单项二", key: "item-2" },
];

interface IEditorProps extends NsJsonSchemaForm.IFormItemProps {
  controlSchema: NsJsonSchemaForm.IControlSchema;
  placeholder?: string;
  disabled: boolean;
}

const Editor: React.FC<IEditorProps> = (props) => {
  const { placeholder, disabled, onChange, value } = props;
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const insertText = (val: string) => {
    textAreaRef.current && insertTextAtCursor(textAreaRef.current, val);
  };

  return (
    <Card
      type="inner"
      style={{
        margin: "0 -14px",
      }}
      bordered
      title={
        <>
          <Space>
            <Dropdown
              placement="bottom"
              arrow={{ pointAtCenter: true }}
              overlay={
                <Menu items={items} onClick={({ key }) => insertText(key)} />
              }
            >
              <Button>参数</Button>
            </Dropdown>
            <Dropdown
              placement="bottom"
              arrow={{ pointAtCenter: true }}
              overlay={
                <Menu items={items} onClick={({ key }) => insertText(key)} />
              }
            >
              <Button>函数</Button>
            </Dropdown>
          </Space>
          <Divider style={{ margin: "10px 0" }} />
          <Space>
            {tags.map((item) => (
              <Button key={item} onClick={() => insertText(item)}>
                {item}
              </Button>
            ))}
          </Space>
        </>
      }
    >
      <Input.TextArea
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        rows={10}
        ref={textAreaRef}
        onChange={(val) => onChange?.(val.currentTarget.value)}
      />
    </Card>
  );
};

export const EditorShape: React.FC<NsJsonSchemaForm.IControlProps> = (
  props
) => {
  const { controlSchema } = props;
  const { required, tooltip, extra, name, label, placeholder } = controlSchema;
  return (
    <FormItemWrapper schema={controlSchema}>
      {({ disabled, hidden, initialValue }) => {
        return (
          <Form.Item
            name={name}
            label={label}
            initialValue={initialValue}
            tooltip={tooltip}
            extra={extra}
            required={required}
            hidden={hidden}
          >
            {/* 这里的组件可以拿到onChange和value */}
            <Editor
              controlSchema={controlSchema}
              placeholder={placeholder}
              disabled={disabled}
            />
          </Form.Item>
        );
      }}
    </FormItemWrapper>
  );
};
