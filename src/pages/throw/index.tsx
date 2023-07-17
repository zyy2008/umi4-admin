import {
  ProCard,
  BetaSchemaForm,
  CheckCard,
  CheckCardGroupProps,
} from "@ant-design/pro-components";
import { Button, Space } from "antd";
import styles from "./index.less";
import React from "react";
import { X6View } from "./components";
import data, { DataType } from "./json";
import { NsGraph } from "@antv/xflow";
import ButtonModal from "@/components/button-modal";

export default () => {
  const [value, setValue] = React.useState<number>();
  const [open, setOpen] = React.useState<boolean>(false);
  const formatData = React.useMemo<CheckCardGroupProps["options"]>(() => {
    return data.map((item, index) => {
      const { meta } = item;
      return { title: meta?.name, value: index };
    });
  }, []);
  const findData = React.useMemo<DataType>(() => {
    if (value != void 0) {
      return data[value];
    }
    return {
      meta: { flowId: "" },
      graphData: { nodes: [], edges: [] },
    };
  }, [value]);
  return (
    <ProCard
      className={styles["card-main"]}
      split="vertical"
      bordered
      headerBordered
      title={<span className="title-main">{findData.meta.name}</span>}
      extra={
        <Space>
          <BetaSchemaForm
            width={600}
            trigger={
              <Button type="primary" size="small">
                流程启动
              </Button>
            }
            title="流程运行"
            layoutType="ModalForm"
            modalProps={{
              okText: "运行",
            }}
            layout="horizontal"
            labelCol={{ span: 3 }}
            wrapperCol={{
              span: 21,
            }}
            columns={[
              {
                title: "时间",
                dataIndex: "time",
                valueType: "dateTimeRange",
                fieldProps: {
                  placeholder: ["开始时间", "结束时间"],
                },
                formItemProps: {
                  rules: [
                    {
                      required: true,
                      message: "此项为必填项",
                    },
                  ],
                },
              },
              {
                title: "启动事件",
                dataIndex: "events",
                valueType: "checkbox",
                fieldProps: {
                  options: formatData?.map((item: any) => ({
                    label: item?.title,
                    ...item,
                  })),
                },
                formItemProps: {
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
          <ButtonModal
            buttonProps={{
              children: "运行结果",
              size: "small",
              type: "default",
              onClick: () => setOpen(true),
            }}
            modalProps={{
              open,
              onCancel: () => setOpen(false),
            }}
          />
        </Space>
      }
      style={{
        height: "100%",
      }}
      size="small"
    >
      <ProCard
        title={<span className="title-sub">{findData.meta.satCode}</span>}
        colSpan="260px"
        headerBordered
      >
        <CheckCard.Group
          className={styles["check-card"]}
          size="small"
          value={value}
          onChange={(val) => setValue(val as any)}
          options={formatData}
        />
      </ProCard>
      <ProCard
        style={{
          height: "100%",
        }}
      >
        <X6View viewData={findData.graphData} />
      </ProCard>
    </ProCard>
  );
};
