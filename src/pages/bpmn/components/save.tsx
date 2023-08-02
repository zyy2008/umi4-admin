import React from "react";
import { BetaSchemaForm, ProFormColumnsType } from "@ant-design/pro-components";
import { IToolbarItemOptions, useXFlowApp, uuidv4 } from "@antv/xflow";
import { Radio, Space, TimePicker, message } from "antd";
import moment from "moment";
import { customEventSave } from "@/pages/bpmn/service";

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
    <BetaSchemaForm<{
      eventName: string;
    }>
      modalProps={{
        maskClosable: false,
        destroyOnClose: true,
      }}
      title="保存"
      onFinish={async (value) => {
        const data = await app.getGraphData();
        const res = await customEventSave({
          eventId: uuidv4(),
          eventData: JSON.stringify(data),
          ...value,
        });
        if (res === "success") {
          message.success("保存成功");
          return true;
        }
        message.warning("保存失败");
        return false;
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
          dataIndex: "eventName",
          formItemProps: {
            rules: [
              {
                required: true,
                message: "此项为必填项",
              },
            ],
          },
        },
        // {
        //   valueType: "dependency",
        //   name: ["saveType"],
        //   columns: ({ saveType }) => {
        //     return [
        //       {
        //         title: "触发方式",
        //         dataIndex: "triggerType",
        //         valueType: "checkbox",
        //         fieldProps: {
        //           options: [
        //             {
        //               label: "计划任务",
        //               value: "1",
        //             },
        //             {
        //               label: "应急任务",
        //               value: "2",
        //             },
        //           ],
        //         },
        //         formItemProps: {
        //           rules: [
        //             {
        //               required: true,
        //               message: "此项为必填项",
        //             },
        //           ],
        //         },
        //       },
        //     ];
        //   },
        // },
        // {
        //   valueType: "dependency",
        //   name: ["triggerType", "saveType"],
        //   columns: ({
        //     triggerType,
        //     saveType,
        //   }: {
        //     triggerType: string[];
        //     saveType: string;
        //   }) => {
        //     const columns: ProFormColumnsType[] = [
        //       {
        //         title: "频次",
        //         dataIndex: "frequency",
        //         renderFormItem: () => {
        //           return <FieldRadioTime />;
        //         },
        //         formItemProps: {
        //           rules: [
        //             {
        //               required: true,
        //               message: "此项为必填项",
        //             },
        //           ],
        //         },
        //       },
        //       {
        //         title: "主题",
        //         dataIndex: "topic",
        //         formItemProps: {
        //           rules: [
        //             {
        //               required: true,
        //               message: "此项为必填项",
        //             },
        //           ],
        //         },
        //       },
        //     ];

        //     return columns;
        //   },
        //   formItemProps: {
        //     rules: [
        //       {
        //         required: true,
        //         message: "此项为必填项",
        //       },
        //     ],
        //   },
        // },
      ]}
    />
  );
};

export default Save;
