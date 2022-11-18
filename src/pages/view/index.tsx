import { ProCard } from "@ant-design/pro-components";
import { Button } from "antd";

const View = () => (
  <ProCard split="vertical">
    <ProCard title="左侧详情" colSpan="30%">
      左侧内容
    </ProCard>
    <ProCard
      title={<div>123</div>}
      headerBordered
      colSpan="200px"
      headStyle={{ textAlign: "center", display: "flex" }}
      bodyStyle={{
        padding: 0,
      }}
    >
      <ProCard title="列表" headerBordered extra={<Button>导入</Button>}>
        123
      </ProCard>
    </ProCard>
    <ProCard title="左右分栏子卡片带标题" headerBordered>
      <div style={{ height: 360 }}>右侧内容</div>
    </ProCard>
  </ProCard>
);

export default View;
