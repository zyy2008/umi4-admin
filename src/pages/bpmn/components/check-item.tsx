import React from "react";
import { DatePicker, Form, Input, Button, Space, message } from "antd";
import { ProCard, ProTable } from "@ant-design/pro-components";
const { RangePicker } = DatePicker;

const CkeckItem = () => {
  return (
    <ProCard
      title={
        <Form layout="inline">
          <Form.Item>
            <RangePicker showTime />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary">查询</Button>
              <Button>修改</Button>
            </Space>
          </Form.Item>
        </Form>
      }
      direction="column"
      gutter={[0, 16]}
      style={{ marginBlockStart: 8 }}
      headStyle={{
        padding: 0,
      }}
      bodyStyle={{
        paddingLeft: 0,
        paddingRight: 0,
      }}
      size="small"
    >
      <ProCard bordered headerBordered split="vertical" size="small">
        <ProCard
          title="事实列表"
          headerBordered
          colSpan="50%"
          type="inner"
          headStyle={{
            paddingLeft: 0,
            paddingRight: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ height: 360 }}>
            <ProTable
              search={false}
              options={false}
              pagination={false}
              rowKey="name"
              dataSource={[
                {
                  name: "1",
                  type: "2",
                },
              ]}
              columns={[
                {
                  title: "名称",
                  dataIndex: "name",
                },
                {
                  title: "类型",
                  dataIndex: "type",
                },
              ]}
            />
          </div>
        </ProCard>
        <ProCard
          title="errorMsg"
          headerBordered
          type="inner"
          headStyle={{
            paddingLeft: 0,
            paddingRight: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ height: 360 }}>右侧内容</div>
        </ProCard>
      </ProCard>
      <ProCard type="inner" title="输出结果" bordered>
        <Input.TextArea />
      </ProCard>
    </ProCard>
  );
};
export default CkeckItem;
