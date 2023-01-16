import React from "react";
import { ProCard } from "@ant-design/pro-components";
import {
  useView,
  useFileTreeSelect,
  useData,
  DProps,
  useParams,
} from "./hooks";
import {
  ViewLeft,
  ViewRight,
  CheckList,
  File,
  NodeView,
  ParamsExport,
  Object,
} from "./components";
import styles from "./index.less";
import type { DataNode } from "antd/es/tree";
import TestExport from "./test-export";

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
  const { onOk, graphData, setGraphData, leftRef, rightRef } = useData({
    data,
    formatData,
    selectValue: value,
  });
  const { onChange, nodesValue, disabled, setDisabled } = useView({
    graphData,
    rightRef,
  });
  const { setParams, params } = useParams();
  return (
    <Context.Provider value={{ data, formatData, formatTreeData }}>
      <ProCard
        split="horizontal"
        bordered
        className={styles["view-graph"]}
        // title={<TestExport />}
      >
        <ProCard
          split="vertical"
          style={{
            height: "100%",
          }}
        >
          <ProCard
            title="整体结构"
            colSpan="30%"
            type="inner"
            bodyStyle={{
              padding: 0,
            }}
            style={{
              height: "100%",
            }}
            extra={<Object />}
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
              title={<File onSuccess={onSuccess} leftRef={leftRef} />}
              extra={
                <NodeView value={value} onChange={onSelectChange} onOk={onOk} />
              }
              headerBordered={false}
            >
              {/* <ViewLeft ref={leftRef} graphData={graphData} /> */}
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
              extra={<ParamsExport onOk={setParams} />}
            >
              <CheckList
                disabled={disabled}
                onChange={onChange}
                nodesValue={nodesValue}
                rightRef={rightRef}
                params={params}
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
            <ViewRight
              ref={rightRef}
              setDisabled={setDisabled}
              setGraphData={setGraphData}
            />
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
