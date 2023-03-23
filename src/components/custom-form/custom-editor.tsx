import React from "react";
import type { NsJsonSchemaForm } from "@antv/xflow";
import { FormItemWrapper } from "./index";
import {
  Input,
  Dropdown,
  Button,
  Space,
  Menu,
  Card,
  Divider,
  List,
  Popover,
  Empty,
} from "antd";
import insertTextAtCursor from "insert-text-at-cursor";
import { ParamBean } from "@/services";
import VirtualList from "rc-virtual-list";
import styles from "./styles.less";
import { CardRadio } from "./index";

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
  disabled?: boolean;
  originData?: Record<string, any>;
}

type ParamMenuProps = {
  onClick: (T: { key: string }) => void;
};

const ParamMenu: React.FC<ParamMenuProps> = (props) => {
  const { onClick } = props;
  const [data, setData] = React.useState<ParamBean[]>([]);
  return (
    <List
      className={styles["list"]}
      bordered
      size="small"
      header={<CardRadio onChange={setData} />}
    >
      {data.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
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
      )}
    </List>
  );
};

const Editor: React.FC<IEditorProps> = (props) => {
  const { placeholder, disabled, onChange, value, originData = {} } = props;
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
  const { originData } = controlSchema;
  return (
    <FormItemWrapper {...props}>
      {({ placeholder, disabled }) => {
        return (
          <Editor
            controlSchema={controlSchema}
            placeholder={placeholder}
            disabled={disabled}
            originData={originData}
          />
        );
      }}
    </FormItemWrapper>
  );
};
