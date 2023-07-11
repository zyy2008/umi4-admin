import React from "react";
import { ProTable, ProTableProps } from "@ant-design/pro-components";
import { VList } from "virtuallist-antd";
import { Input } from "antd";

const VirtualTable = <T extends object, U extends object, ValueType = "text">(
  props: ProTableProps<T, U, ValueType>
) => {
  const { scroll } = props;
  const vComponents = React.useMemo(() => {
    // 使用VList 即可有虚拟列表的效果
    return VList({
      height: scroll?.y ?? 300, // 此值和scrollY值相同. 必传. (required).  same value for scrolly
    });
  }, [scroll?.y]);
  return <ProTable {...props} components={vComponents} search={false} />;
};
// Usage

const data = Array.from({ length: 1000 }, (_, key) => ({
  key,
  id: `aaa${key}`,
}));

const App: React.FC = () => (
  <VirtualTable
    columns={[
      {
        title: "A",
        dataIndex: "key",
      },
      {
        title: "B",
        dataIndex: "key",
        render: () => {
          return <Input />;
        },
      },
    ]}
    rowSelection={{
      type: "checkbox",
    }}
    dataSource={data}
    scroll={{ y: 300 }}
    pagination={false}
    rowKey="id"
  />
);

export default App;
