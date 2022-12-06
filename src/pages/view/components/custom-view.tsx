import React from "react";
import { ProCard } from "@ant-design/pro-components";

const CustomView: React.FC<{}> = () => {
  return (
    <ProCard split="vertical" bordered headerBordered>
      <ProCard title="所有节点" colSpan="33%">
        <div style={{ height: 360 }}>左侧内容</div>
      </ProCard>
      <ProCard title="选中节点及子节点">
        <div style={{ height: 360 }}>右侧内容</div>
      </ProCard>
      <ProCard title="编辑节点">
        <div style={{ height: 360 }}>右侧内容</div>
      </ProCard>
    </ProCard>
  );
};

export default CustomView;
