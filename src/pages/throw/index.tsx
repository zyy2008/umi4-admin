import {
  ProCard,
  BetaSchemaForm,
  CheckCard,
  CheckCardGroupProps,
} from "@ant-design/pro-components";
import { Button, Checkbox } from "antd";
import styles from "./index.less";
import React from "react";
import { X6View } from "./components";
import data from "./json";

export default () => {
  const [value, setValue] = React.useState<number>();
  const formatData = React.useMemo<CheckCardGroupProps["options"]>(() => {
    return data.map((item, index) => {
      const find = item.nodes.filter(
        (item) => item.renderKey === "StartProcessNode"
      );
      const [{ label }] = find;
      return { title: label, value: index };
    });
  }, []);
  return (
    <ProCard
      split="vertical"
      bordered
      headerBordered
      style={{
        height: "100%",
      }}
      size="small"
    >
      <ProCard
        title="事件"
        colSpan="260px"
        headerBordered
        extra={
          <BetaSchemaForm
            width={600}
            trigger={
              <Button type="primary" size="small">
                启动
              </Button>
            }
            title="启动"
            layoutType="ModalForm"
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
        }
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
        <X6View selectValue={value} />
      </ProCard>
    </ProCard>
  );
};
