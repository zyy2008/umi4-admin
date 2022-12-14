import React from "react";
import { Transfer, Tree, TransferProps } from "antd";
import type { TransferDirection, TransferItem } from "antd/es/transfer";
import type { DataNode } from "antd/es/tree";

export interface TreeTransferProps {
  dataSource: DataNode[];
  targetKeys: string[];
  onChange: (
    targetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[]
  ) => void;
  titles?: React.ReactNode[];
  style?: React.CSSProperties;
  height?: number;
  status?: TransferProps<any>["status"];
}

// Customize Table Transfer
const isChecked = (
  selectedKeys: (string | number)[],
  eventKey: string | number
) => selectedKeys.includes(eventKey);

const generateTree = (
  treeNodes: DataNode[] = [],
  checkedKeys: string[] = []
): DataNode[] =>
  treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key as string),
    children: generateTree(children, checkedKeys),
  }));

const TreeTransfer: React.FC<TreeTransferProps> = ({
  dataSource,
  targetKeys,
  height,
  status,
  ...restProps
}: TreeTransferProps) => {
  const transferDataSource: TransferItem[] = [];
  function flatten(list: DataNode[] = []) {
    list.forEach((item) => {
      transferDataSource.push(item as TransferItem);
      flatten(item.children);
    });
  }
  flatten(dataSource);

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      render={(item) => item.title!}
      showSelectAll={false}
      status={status}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === "left") {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          const treeData = generateTree(dataSource, targetKeys);
          if (treeData.length === 0) {
            return;
          }
          return (
            <Tree
              height={height}
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              checkedKeys={checkedKeys}
              treeData={treeData}
              onCheck={(_, { node: { key } }) => {
                onItemSelect(key as string, !isChecked(checkedKeys, key));
              }}
              onSelect={(_, { node: { key } }) => {
                onItemSelect(key as string, !isChecked(checkedKeys, key));
              }}
            />
          );
        }
      }}
    </Transfer>
  );
};

export default TreeTransfer;
