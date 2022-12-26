import React from "react";
import { Space, TreeSelect, TreeSelectProps, TransferProps } from "antd";
import ButtonModal from "@/components/button-modal";
import { SettingOutlined } from "@ant-design/icons";
import { CustomView } from "./index";

type NodeViewProps = Pick<TreeSelectProps, "value" | "onChange"> & {
  onOk: (T: string[]) => void;
};

const treeData: TreeSelectProps["treeData"] = [
  {
    title: "整星",
    value: 0,
    key: 0,
  },
  {
    title: "分系统",
    value: 1,
    key: 1,
  },
  {
    title: "器部件",
    value: 2,
    key: 2,
  },
  {
    title: "参数",
    value: 3,
    key: 3,
  },
];

const NodeView: React.FC<NodeViewProps> = (props) => {
  const { value, onChange, onOk } = props;
  const [targetKeys, setTargetKeys] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<TransferProps<any>["status"]>("");
  return (
    <Space.Compact block>
      <TreeSelect
        value={value}
        placeholder="显示层级"
        treeData={treeData}
        treeCheckable
        style={{
          width: 160,
        }}
        maxTagCount="responsive"
        onChange={onChange}
      />
      <ButtonModal
        buttonProps={{
          icon: <SettingOutlined />,
          type: "default",
          onClick: () => {
            setOpen(true);
          },
        }}
        tooltipProps={{
          title: "自定义节点显示",
        }}
        modalProps={{
          title: "自定义显示节点选择页",
          width: 800,
          children: (
            <CustomView
              targetKeys={targetKeys}
              onChange={setTargetKeys}
              status={status}
            />
          ),
          open,
          onCancel: () => {
            setOpen(false);
          },
          onOk: () => {
            if (targetKeys.length === 0) {
              setStatus("error");
            } else {
              setStatus("");
              setOpen(false);
              onOk?.(targetKeys);
            }
          },
        }}
      />
    </Space.Compact>
  );
};

export default NodeView;
