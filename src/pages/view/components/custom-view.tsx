import React from "react";
import {
  ProCard,
  CheckCard,
  CheckCardGroupProps,
} from "@ant-design/pro-components";
import { List, Input, Empty } from "antd";
import VirtualList from "rc-virtual-list";
import { NsGraph } from "@antv/xflow";
import TreeTransfer from "@/components/tree-transfer";
import type { DataNode } from "antd/es/tree";
import type { DProps } from "../hooks";
import { Context } from "@/pages/view";
import { treeDeep } from "@/utils";

type ListVirtualProps = {
  title?: string;
  loading?: boolean;
  header?: React.ReactNode;
} & Pick<CheckCardGroupProps, "value" | "onChange">;

type TransferProps = Pick<CheckCardGroupProps, "value">;

const { Search } = Input;

const ListVirtual: React.FC<ListVirtualProps> = (props) => {
  const { title, loading, header, value, onChange } = props;
  const { formatData } = React.useContext(Context);
  const [keyword, setKeyword] = React.useState<string>("");
  const data = React.useMemo<NsGraph.INodeConfig[]>(() => {
    const list = formatData.filter((node) => {
      return node.label?.includes(keyword) && node.mark < 3;
    });
    return list;
  }, [formatData, keyword]);
  return (
    <CheckCard.Group value={value} onChange={onChange}>
      <List
        loading={loading}
        dataSource={[]}
        header={
          <div className="node-title">
            <span>{title}</span>
            <Search
              onSearch={setKeyword}
              allowClear
              placeholder="过滤条件"
              size="middle"
            />
            {header}
          </div>
        }
      >
        {data?.length > 0 ? (
          <VirtualList data={data} height={300} itemHeight={36} itemKey="id">
            {(item) => (
              <List.Item style={{ padding: 0 }}>
                <CheckCard
                  title={item.label}
                  value={item.id}
                  style={{
                    margin: 0,
                  }}
                />
              </List.Item>
            )}
          </VirtualList>
        ) : (
          <Empty
            style={{
              height: 200,
            }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </List>
    </CheckCard.Group>
  );
};

type TProps = {
  data: DProps["data"];
  value: string;
};

const Transfer: React.FC<TransferProps> = (props) => {
  const { value } = props;
  const { formatTreeData } = React.useContext(Context);
  const [targetKeys, setTargetKeys] = React.useState<string[]>([]);
  const dataSource = React.useMemo<DataNode[]>(() => {
    const res = treeDeep({ key: value as string, formatTreeData });
    console.log(res);
    return res;
  }, [formatTreeData, value]);
  return (
    <TreeTransfer
      style={{
        height: "100%",
      }}
      dataSource={dataSource}
      targetKeys={targetKeys}
      onChange={setTargetKeys}
      titles={["选中节点及子节点", "编辑节点"]}
    />
  );
};

const CustomView: React.FC<{}> = () => {
  const [value, setValue] = React.useState<CheckCardGroupProps["value"]>();
  return (
    <ProCard split="vertical" headerBordered>
      <ProCard
        title="所有节点"
        colSpan="33%"
        headerBordered
        size="small"
        bordered
      >
        <ListVirtual value={value} onChange={setValue} />
      </ProCard>
      <ProCard
        size="small"
        bodyStyle={{ padding: 0 }}
        style={{
          height: "100%",
          paddingLeft: 10,
        }}
        bordered={false}
      >
        <Transfer value={value} />
      </ProCard>
    </ProCard>
  );
};

export default CustomView;
