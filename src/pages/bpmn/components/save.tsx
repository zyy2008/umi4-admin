import React from "react";
import { BetaSchemaForm, ProFormColumnsType } from "@ant-design/pro-components";
import { IToolbarItemOptions, useXFlowApp } from "@antv/xflow";
import { Radio, Space, TimePicker } from "antd";
import moment from "moment";

type FieldRadioTimeProps = {
  onChange?: <T = any>(value: T) => void;
  value?: any;
};

const FieldRadioTime: React.FC<FieldRadioTimeProps> = (props) => {
  const { value = ["week"], onChange } = props;
  const [radioValue, setRadioValue] = React.useState<string>("week");
  const timeValue = React.useMemo<moment.Moment | null>(() => {
    if (value?.[1]) {
      return moment(value[1], "HH:mm:ss");
    }
    return null;
  }, [value]);
  return (
    <Space>
      <Radio.Group
        value={radioValue}
        options={[
          {
            label: "周",
            value: "week",
          },
          {
            label: "月",
            value: "month",
          },
        ]}
        optionType="button"
        buttonStyle="solid"
        onChange={({ target: { value: radio } }) => {
          setRadioValue(radio);
          onChange?.(value?.[1] ? [radio, value[1]] : null);
        }}
      />
      <TimePicker
        value={timeValue}
        onChange={(_, time) => {
          onChange?.(time ? [radioValue, time] : null);
        }}
      />
    </Space>
  );
};

const Save: IToolbarItemOptions["render"] = (props) => {
  const { children } = props;
  const app = useXFlowApp();
  return (
    <BetaSchemaForm
      modalProps={{
        maskClosable: false,
        destroyOnClose: true,
      }}
      title="保存"
      onFinish={async (value) => {
        console.log(value);
        return true;
      }}
      trigger={
        <div
          className="x6-toolbar-item xflow-toolbar-item"
          style={{
            padding: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          {children}
        </div>
      }
      layoutType="ModalForm"
      columns={[
        {
          title: "名称",
          dataIndex: "name",
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
          title: "保存类型",
          dataIndex: "saveType",
          valueType: "radio",
          fieldProps: {
            options: [
              {
                label: "事件工具",
                value: "1",
              },
              {
                label: "公共事件",
                value: "2",
              },
              {
                label: "普通事件",
                value: "3",
              },
            ],
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
          valueType: "dependency",
          name: ["saveType"],
          columns: ({ saveType }) => {
            if (saveType === "2" || saveType === "3") {
              return [
                {
                  title: "触发方式",
                  dataIndex: "triggerType",
                  valueType: "checkbox",
                  fieldProps: {
                    options: [
                      {
                        label: "计划任务",
                        value: "1",
                      },
                      {
                        label: "应急任务",
                        value: "2",
                      },
                    ],
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
              ];
            }

            return [];
          },
        },
        {
          valueType: "dependency",
          name: ["triggerType", "saveType"],
          columns: ({
            triggerType,
            saveType,
          }: {
            triggerType: string[];
            saveType: string;
          }) => {
            if (saveType === "2" || saveType === "3") {
              const columns: ProFormColumnsType[] = [
                {
                  title: "频次",
                  dataIndex: "frequency",
                  renderFormItem: () => {
                    return <FieldRadioTime />;
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
                  title: "主题",
                  dataIndex: "topic",
                  formItemProps: {
                    rules: [
                      {
                        required: true,
                        message: "此项为必填项",
                      },
                    ],
                  },
                },
              ];
              if (triggerType) {
                return triggerType.map((key) => columns[Number(key) - 1]);
              }
            }

            return [];
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
  );
};

export default Save;
