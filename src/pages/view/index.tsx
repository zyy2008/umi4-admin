import React from "react";
import { ProCard } from "@ant-design/pro-components";
import ButtonModal from "@/components/button-modal";
import { useView, useFileTreeSelect, useData, DProps } from "./hooks";
import { ViewLeft, ViewRight, CheckList, File, NodeView } from "./components";
import styles from "./index.less";
import { Transfer } from "./components/transfer";
import type { DataNode } from "antd/es/tree";

export type ViewContext = Omit<DProps, "selectValue"> & {
  formatTreeData: DataNode[];
};

export const Context = React.createContext<ViewContext>({
  data: [],
  formatData: [],
  formatTreeData: [],
});

const View = () => {
  const {
    value,
    onSelectChange,
    onSuccess,
    data = [],
    formatData,
    formatTreeData,
  } = useFileTreeSelect();
  const { selectData, onOk, graphData, leftRef, rightRef } = useData({
    data,
    formatData,
    selectValue: value,
  });
  const { onChange, nodesValue, x6Graph, disabled, setDisabled } = useView({
    graphData: selectData,
  });
  return (
    <Context.Provider value={{ data, formatData, formatTreeData }}>
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
              title={<File onSuccess={onSuccess} />}
              extra={
                <NodeView value={value} onChange={onSelectChange} onOk={onOk} />
              }
              headerBordered={false}
            >
              <ViewLeft ref={leftRef} graphData={graphData} />
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
              <CheckList
                disabled={disabled}
                onChange={onChange}
                nodesValue={nodesValue}
                x6Graph={x6Graph}
              />
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
            <ViewRight ref={rightRef} setDisabled={setDisabled} />
          </ProCard>
        </ProCard>

        <ProCard type="inner">
          已关联卫星知识1个，分系统知识2个，器部件知识3个，参数知识2个，未关联4个
        </ProCard>
      </ProCard>
    </Context.Provider>
  );
};

export default View;
