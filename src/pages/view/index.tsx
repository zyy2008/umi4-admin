import { ProCard } from "@ant-design/pro-components";
import { Button, Space, Tooltip, TreeSelect } from "antd";
import {
  ImportOutlined,
  ExportOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ButtonModal from "@/components/button-modal";
import { Transfer, ListCheck, ViewLeft, ViewRight } from "./components";
import styles from "./index.less";

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
  <ProCard split="horizontal" bordered className={styles["view-graph"]}>
    <ProCard
      split="vertical"
      style={{
        height: "100%",
      }}
    >
      <ProCard
        title="整星结构"
        colSpan="30%"
        type="inner"
        bodyStyle={{
          padding: 0,
        }}
        style={{
          height: "100%",
        }}
      >
        <ProCard
          type="inner"
          bodyStyle={{
            padding: 0,
            height: "100%",
          }}
          style={{
            height: "calc(100% - 65px)",
          }}
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
                  width: 160,
                }}
                maxTagCount="responsive"
              />
              <ButtonModal
                buttonProps={{ icon: <SettingOutlined />, type: "default" }}
                tooltipProps={{
                  title: "自定义节点显示",
                }}
                modalProps={{
                  title: "自定义显示节点选择页",
                  width: 800,
                  children: <ListCheck />,
                }}
              />
            </Space.Compact>
          }
          headerBordered={false}
        >
          <ViewLeft />
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
          extra={
            <ButtonModal
              buttonProps={{ children: "导入" }}
              modalProps={{
                title: "参数导入",
                children: <Transfer />,
                width: 600,
              }}
            />
          }
        >
          22
        </ProCard>
      </ProCard>
      <ProCard
        title="编辑区"
        headerBordered
        type="inner"
        style={{
          height: "100%",
        }}
        bodyStyle={{
          padding: 0,
        }}
      >
        <ViewRight />
      </ProCard>
    </ProCard>

    <ProCard type="inner">
      已关联卫星知识1个，分系统知识2个，器部件知识3个，参数知识2个，未关联4个
    </ProCard>
  </ProCard>
);

export default View;
