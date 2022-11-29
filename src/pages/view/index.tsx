import { ProCard } from "@ant-design/pro-components";
import { Button, Space, Tooltip, TreeSelect } from "antd";
import {
  ImportOutlined,
  ExportOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const treeData = [
  {
    title: "整星",
    value: "0-1",
    key: "0-1",
  },
  {
    title: "分系统",
    value: "0-1-0",
    key: "0-1-0",
  },
  {
    title: "器部件",
    value: "0-1-1",
    key: "0-1-1",
  },
  {
    title: "参数",
    value: "0-1-2",
    key: "0-1-2",
  },
];

const View = () => (
  <ProCard split="horizontal" bordered>
    <ProCard split="vertical">
      <ProCard
        title="整星结构"
        colSpan="30%"
        type="inner"
        bodyStyle={{
          padding: 0,
        }}
      >
        <ProCard
          type="inner"
          title={
            <Space>
              <Tooltip placement="bottom" title="导入知识图谱">
                <Button icon={<ImportOutlined />} />
              </Tooltip>
              <Tooltip placement="bottom" title="导出知识图谱">
                <Button icon={<ExportOutlined />} />
              </Tooltip>
            </Space>
          }
          extra={
            <Space.Compact block>
              <TreeSelect
                placeholder="显示层级"
                treeData={treeData}
                treeCheckable
                style={{
                  width: 200,
                }}
              />
              <Tooltip placement="bottom" title="自定义节点显示">
                <Button icon={<SettingOutlined />} />
              </Tooltip>
            </Space.Compact>
          }
          headerBordered={false}
        >
          123
        </ProCard>
      </ProCard>
      <ProCard
        title="参数"
        headerBordered
        colSpan="200px"
        headStyle={{ textAlign: "center", display: "flex" }}
        bodyStyle={{
          padding: 0,
        }}
        type="inner"
      >
        <ProCard
          title="列表"
          headerBordered
          extra={<Button type="primary">导入</Button>}
        >
          123
        </ProCard>
      </ProCard>
      <ProCard title="编辑区" headerBordered type="inner">
        <div style={{ height: 360 }}>右侧内容</div>
      </ProCard>
    </ProCard>

    <ProCard type="inner">左侧内容</ProCard>
  </ProCard>
);

export default View;
