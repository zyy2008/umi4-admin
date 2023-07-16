import React from "react";
import { Drawer as BaseDrawer, Form, Table, Image, Row, Card, Col } from "antd";
import { Graph, Cell } from "@antv/x6";
import { ProCard } from "@ant-design/pro-components";
import styles from "./index.less";
import { ViewContext } from "./index";

const DrawerBody: React.FC<{ data?: { [key: string]: any } }> = (props) => {
  const { data } = props;
  if (data) {
    switch (data.shape) {
      case "ProcessNode":
        return (
          <ProCard
            tabs={{
              type: "card",
            }}
          >
            <ProCard.TabPane key="tab1" tab="基本信息">
              <Form
                labelCol={{
                  span: 6,
                }}
                className={styles["form"]}
              >
                <Form.Item label="名称">{data?.label}</Form.Item>
                <Form.Item label="辅助软件">{data?.soft}</Form.Item>
                <Form.Item label="处置方案">{data?.deal}</Form.Item>
                {data?.condition != null && (
                  <Form.Item label="子节点关系">
                    {data?.condition === 0 ? "与" : "或"}
                  </Form.Item>
                )}
              </Form>
            </ProCard.TabPane>
            <ProCard.TabPane key="tab2" tab="文字">
              <p style={{ padding: 0 }}>{data?.text}</p>
            </ProCard.TabPane>
            <ProCard.TabPane key="tab3" tab="文档">
              <Table
                columns={[
                  {
                    title: "文件名称",
                    dataIndex: "name",
                    key: "name",
                  },
                  {
                    title: "操作",
                    dataIndex: "",
                    key: "x",
                    render: () => <a>下载</a>,
                  },
                ]}
              />
            </ProCard.TabPane>
            <ProCard.TabPane key="tab4" tab="图片">
              <Row gutter={[8, 8]}>
                <Col span={8}>
                  <Card hoverable bodyStyle={{ padding: 0 }}>
                    <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card bodyStyle={{ padding: 0 }}>
                    <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card bodyStyle={{ padding: 0 }}>
                    <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                  </Card>
                </Col>
              </Row>
            </ProCard.TabPane>
            <ProCard.TabPane key="tab5" tab="连接">
              <Form
                labelCol={{
                  span: 6,
                }}
                className={styles["form"]}
              >
                {[
                  "https://ant.design/",
                  "https://ant.design/",
                  "https://ant.design",
                ].map((url, index) => {
                  return (
                    <Form.Item label={`地址${index}`} key={index}>
                      <a href={url} target="_blank">
                        {url}
                      </a>
                    </Form.Item>
                  );
                })}
              </Form>
            </ProCard.TabPane>
          </ProCard>
        );

      case "ConnectorNode":
      case "SquareNode":
        return (
          <Form
            labelCol={{
              span: 6,
            }}
            className={styles["form"]}
          >
            <Form.Item label="名称">{data?.label}</Form.Item>
            <Form.Item label="判断规则">{data?.expression}</Form.Item>
          </Form>
        );
      default:
        return (
          <Form
            labelCol={{
              span: 6,
            }}
            className={styles["form"]}
          >
            <Form.Item label="名称">{data?.label}</Form.Item>
          </Form>
        );
    }
  }
  return null;
};

const Drawer: React.FC = () => {
  const { open, setOpen, graph } = React.useContext(ViewContext);
  console.log(open);
  const onClose = () => {
    setOpen?.({
      value: false,
      data: {},
    });
    graph && graph.cleanSelection();
  };
  return (
    <BaseDrawer
      className={styles["drawer"]}
      title={open?.data?.label ?? ""}
      placement="right"
      onClose={onClose}
      open={open?.value}
      maskClosable={false}
      width={400}
      bodyStyle={{
        padding: 0,
      }}
    >
      <DrawerBody data={open?.data} />
    </BaseDrawer>
  );
};

export default Drawer;
