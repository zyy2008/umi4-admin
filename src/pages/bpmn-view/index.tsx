import React from "react";
import { ProCard, CheckCard, BetaSchemaForm } from "@ant-design/pro-components";
import { Tag, Progress, Card, Pagination, Empty } from "antd";
import styles from "./index.less";
import { DrawerFlow } from "./components";

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
  const [checkValue, setCheckValue] = React.useState<string>();
  const [data, setData] = React.useState<number[]>([]);

  React.useEffect(() => {
    setTimeout(() => {
      setData([...new Array(100).keys()]);
    }, 3000);
  }, []);
  return (
    <ProCard
      size="small"
      bordered
      headerBordered
      type="inner"
      className={styles["view"]}
      title={
        <BetaSchemaForm
          span={6}
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
      <Card
        title={
          <CheckCard.Group
            value={checkValue}
            onChange={(value) => {
              setCheckValue(value as string);
            }}
            className={styles["check"]}
          >
            {data.length > 0 ? (
              data.map((key) => {
                return (
                  <CheckCard
                    key={key}
                    title="Card A"
                    description="选项一"
                    value={key}
                  />
                );
              })
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </CheckCard.Group>
        }
      >
        <Pagination defaultCurrent={1} total={50} />
      </Card>
      <DrawerFlow checkValue={checkValue} setCheckValue={setCheckValue} />
    </ProCard>
  );
};

export default BpmnView;
