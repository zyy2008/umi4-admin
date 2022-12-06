import React from "react";
import { ProCard } from "@ant-design/pro-components";
import { Button, Space, Tooltip, TreeSelect } from "antd";
import type { NsGraph } from "@antv/xflow";
import {
  ImportOutlined,
  ExportOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ButtonModal from "@/components/button-modal";
import {
  Transfer,
  CustomView,
  ViewLeft,
  ViewRight,
  CheckList,
} from "./components";
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

export type CallbackHistory = (args: NsGraph.IGraphData) => void;
export type CallbackDisabled = (args: boolean) => void;

const View = () => {
  const [graphData, setGraphData] = React.useState<NsGraph.IGraphData>();
  const [disabled, setDisabled] = React.useState<boolean>(true);

  const callbackHistory = React.useCallback<CallbackHistory>(
    (val) => setGraphData(val),
    []
  );
  const callbackDisabled = React.useCallback<CallbackDisabled>(
    (val) => setDisabled(val),
    []
  );

  return (
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
              height: "100%",
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
                    children: <CustomView />,
                  }}
                />
              </Space.Compact>
            }
            headerBordered={false}
          >
            <ViewLeft graphData={graphData} />
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
          style={{
            height: "100%",
          }}
          type="inner"
        >
          <ProCard
            title="列表"
            headerBordered
            bodyStyle={{
              padding: 0,
              position: "relative",
            }}
            style={{
              height: "100%",
            }}
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
            <CheckList disabled={disabled} />
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
          <ViewRight
            callbackHistory={callbackHistory}
            callbackDisabled={callbackDisabled}
          />
        </ProCard>
      </ProCard>

      <ProCard type="inner">
        已关联卫星知识1个，分系统知识2个，器部件知识3个，参数知识2个，未关联4个
      </ProCard>
    </ProCard>
  );
};

export default View;
