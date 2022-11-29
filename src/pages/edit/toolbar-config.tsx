import React from "react";
import type { IToolbarItemOptions, IToolbarGroupOptions } from "@antv/xflow";
import { createToolbarConfig } from "@antv/xflow";
import { XFlowGraphCommands, IconStore } from "@antv/xflow";
import { SaveOutlined, CheckOutlined, CodeOutlined } from "@ant-design/icons";
import { message } from "antd";
import type { NsGraphCmd } from "@antv/xflow";
import { Modal, DatePicker, Form } from "antd";
import { ProCard } from "@ant-design/pro-components";

const { RangePicker } = DatePicker;

const Check: React.FC<{}> = (props) => {
  console.log(props);
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <>
      <span
        className="x6-toolbar-item xflow-toolbar-item"
        style={{
          padding: 0,
          marginLeft: 0,
          marginRight: 0,
        }}
        onClick={() => setOpen(true)}
      >
        {props.children}
      </span>
      <Modal title="知识校验" open={open} onCancel={() => setOpen(false)}>
        <ProCard
          title={
            <Form>
              <Form.Item>
                <RangePicker showTime />
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
              size="small"
              type="inner"
              headStyle={{
                paddingLeft: 0,
                paddingRight: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ height: 360 }}>左侧内容</div>
            </ProCard>
            <ProCard
              title="errorMsg"
              headerBordered
              size="small"
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
          <ProCard type="inner" title="输出结果" bordered size="small">
            内部卡片内容
          </ProCard>
        </ProCard>
      </Modal>
    </>
  );
};

namespace NsConfig {
  /** 注册icon 类型 */
  IconStore.set("SaveOutlined", SaveOutlined);
  IconStore.set("CheckOutlined", CheckOutlined);
  IconStore.set("CodeOutlined", CodeOutlined);
  /** 获取toobar配置项 */
  export const getToolbarItems: () => Promise<
    IToolbarGroupOptions[]
  > = async () => {
    const toolbarGroup1: IToolbarItemOptions[] = [
      {
        id: "CheckOutlined",
        iconName: "CheckOutlined",
        tooltip: "知识校验",
        render: Check,
      },
      {
        id: "CodeOutlined",
        iconName: "CodeOutlined",
        tooltip: "查看代码",
        onClick: ({ commandService }) => {
          console.log(commandService);
        },
      },
    ];
    const toolbarGroup2: IToolbarItemOptions[] = [
      {
        id: XFlowGraphCommands.SAVE_GRAPH_DATA.id,
        iconName: "SaveOutlined",
        tooltip: "保存数据",
        onClick: async ({ commandService }) => {
          commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
            XFlowGraphCommands.SAVE_GRAPH_DATA.id,
            {
              saveGraphDataService: async (meta, data) => {
                console.log(data);
                console.log(meta);
                message.success("nodes count:" + data.nodes.length);
              },
            }
          );
        },
      },
    ];

    return [
      { name: "nodeGroup", items: toolbarGroup1 },
      { name: "graphGroup", items: toolbarGroup2 },
    ];
  };
}

/** wrap出一个hook */
export const useToolbarConfig = createToolbarConfig((toolbarConfig) => {
  /** 生产 toolbar item */
  toolbarConfig.setToolbarModelService(async (toolbarModel) => {
    const toolbarItems = await NsConfig.getToolbarItems();
    toolbarModel.setValue((toolbar) => {
      toolbar.mainGroups = toolbarItems;
    });
  });
});
