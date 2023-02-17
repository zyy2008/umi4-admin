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
  Radio,
  List,
  Popover,
} from "antd";
import insertTextAtCursor from "insert-text-at-cursor";
import { ParamBean } from "@/services";
import VirtualList from "rc-virtual-list";
import styles from "./styles.less";
import { Context } from "@/pages/edit";

const { Search } = Input;

const tags: string[] = [
  "+",
  "-",
  "*",
  "/",
  "%",
  "!",
  "&",
  "|",
  "<",
  ">",
  ">=",
  "<=",
  "(",
  ")",
  "=",
  "or",
  "and",
  "eq",
  "neq",
  "not",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

interface IEditorProps extends NsJsonSchemaForm.IFormItemProps {
  controlSchema: NsJsonSchemaForm.IControlSchema;
  placeholder?: string;
  disabled: boolean;
}

type ParamMenuProps = {
  onClick: (T: { key: string }) => void;
};

const ParamMenu: React.FC<ParamMenuProps> = (props) => {
  const { onClick } = props;
  const [keyword, setKeyword] = React.useState<string>("");
  const [value, setValue] = React.useState<"params" | "custom">("params");
  const ctx = React.useContext(Context);
  const data = React.useMemo<ParamBean[]>(() => {
    if (value === "params") {
      if (ctx?.params) {
        const list =
          ctx.params.filter((node) => node.tmName?.includes(keyword)) ?? [];
        return list;
      }
      return [];
    } else {
      return [];
    }
  }, [ctx?.params, keyword, value]);
  return (
    <List
      style={{
        width: 220,
      }}
      bordered
      header={
        <Card
          bordered={false}
          headStyle={{
            padding: 0,
          }}
          bodyStyle={{
            padding: 0,
            textAlign: "center",
          }}
          title={
            <Search
              onSearch={setKeyword}
              allowClear
              placeholder="过滤条件"
              size="middle"
            />
          }
        >
          <Radio.Group
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
            buttonStyle="solid"
          >
            <Radio.Button value="params">参数</Radio.Button>
            <Radio.Button value="custom">变量</Radio.Button>
          </Radio.Group>
        </Card>
      }
    >
      <VirtualList<ParamBean>
        data={data}
        height={200}
        itemHeight={36}
        itemKey="tmCode"
      >
        {(item) => (
          <List.Item
            key={item.tmCode}
            onClick={() => onClick?.({ key: item.tmCode })}
          >
            {item.tmName}
          </List.Item>
        )}
      </VirtualList>
    </List>
  );
};

const Editor: React.FC<IEditorProps> = (props) => {
  const { placeholder, disabled, onChange, value } = props;
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);
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
            <Popover
              placement="bottom"
              content={
                <ParamMenu
                  onClick={({ key }) => {
                    insertText(key);
                    setOpen(false);
                  }}
                />
              }
              trigger="click"
              overlayClassName={styles["popover-content"]}
              open={open}
              onOpenChange={setOpen}
            >
              <Button>参数</Button>
            </Popover>
            <Dropdown
              placement="bottom"
              arrow={{ pointAtCenter: true }}
              overlay={
                <Menu
                  items={[
                    {
                      label: "abs()",
                      key: "abs()",
                    },
                    {
                      label: "div()",
                      key: "div()",
                    },
                    {
                      label: "max()",
                      key: "max()",
                    },
                    {
                      label: "min()",
                      key: "min()",
                    },
                  ]}
                  onClick={({ key }) => insertText(key)}
                />
              }
            >
              <Button>函数</Button>
            </Dropdown>
          </Space>
          <Divider style={{ margin: "10px 0" }} />
          <Space wrap>
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
