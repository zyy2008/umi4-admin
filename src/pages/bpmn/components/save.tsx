import React from "react";
import { BetaSchemaForm, ProFormColumnsType } from "@ant-design/pro-components";
import { IToolbarItemOptions, useXFlowApp, uuidv4 } from "@antv/xflow";
import { Radio, Space, TimePicker, message } from "antd";
import moment from "moment";
import { customEventSave, Context } from "@/pages/bpmn";

const Save: IToolbarItemOptions["render"] = (props) => {
  const { children } = props;
  const ctx = React.useContext(Context);
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
          ctx?.event$?.emit("public");
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
      ]}
    />
  );
};

export default Save;
