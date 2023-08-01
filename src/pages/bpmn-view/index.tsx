import React from "react";
import { ProCard, ProList, BetaSchemaForm } from "@ant-design/pro-components";
import { Tag, Progress } from "antd";

const data = [
  "语雀的天空",
  "Ant Design",
  "蚂蚁金服体验科技",
  "TechUI",
  "TechUI 2.0",
  "Bigfish",
  "Umi",
  "Ant Design Pro",
].map((item) => ({
  title: item,
  subTitle: <Tag color="#5BD8A6">语雀专栏</Tag>,
  actions: [<a key="run">邀请</a>, <a key="delete">删除</a>],
  avatar:
    "https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg",
  content: (
    <div
      style={{
        flex: 1,
      }}
    >
      <div
        style={{
          width: 200,
        }}
      >
        <div>发布中</div>
        <Progress percent={80} />
      </div>
    </div>
  ),
}));

const BpmnView = () => {
  return (
    <ProCard
      bordered
      headerBordered
      title={
        <BetaSchemaForm
          layoutType="QueryFilter"
          columns={[
            {
              title: "扫描开始时间",
              dataIndex: "startTime",
              valueType: "dateTime",
              formItemProps: {
                labelCol: {
                  span: 12,
                },
                rules: [
                  {
                    required: true,
                    message: "此项为必填项",
                  },
                ],
              },
            },
            {
              title: "扫描天数",
              dataIndex: "days",
              valueType: "digit",
              formItemProps: {
                labelCol: {
                  span: 12,
                },
                rules: [
                  {
                    required: true,
                    message: "此项为必填项",
                  },
                ],
              },
            },
          ]}
        />
      }
      bodyStyle={{
        padding: 0,
      }}
    >
      <ProList<any>
        pagination={{
          defaultPageSize: 8,
          showSizeChanger: false,
        }}
        showActions="hover"
        rowSelection={{}}
        grid={{ gutter: 16, column: 2 }}
        onItem={(record: any) => {
          return {
            onMouseEnter: () => {
              console.log(record);
            },
            onClick: () => {
              console.log(record);
            },
          };
        }}
        metas={{
          title: {},
          subTitle: {},
          type: {},
          avatar: {},
          content: {},
        }}
        dataSource={data}
      />
    </ProCard>
  );
};

export default BpmnView;
