import React from "react";
import type { IToolbarItemOptions, IToolbarGroupOptions } from "@antv/xflow";
import { createToolbarConfig } from "@antv/xflow";
import { XFlowGraphCommands, IconStore } from "@antv/xflow";
import { SaveOutlined, CheckOutlined, CodeOutlined } from "@ant-design/icons";
import { message } from "antd";
import type { NsGraphCmd } from "@antv/xflow";
import { Modal, Button, Tooltip } from "antd";
import { ProCard } from "@ant-design/pro-components";

const Check: React.FC<{}> = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <>
      <Tooltip placement="bottom" title="知识校验">
        <Button
          icon={<CheckOutlined />}
          className="x6-toolbar-item xflow-toolbar-item"
          type="text"
          onClick={() => setOpen(true)}
        />
      </Tooltip>

      <Modal title="知识校验" open={open} onCancel={() => setOpen(false)}>
        <ProCard
          title="竖向内部卡片"
          bordered
          headerBordered
          direction="column"
          gutter={[0, 16]}
          style={{ marginBlockStart: 8 }}
        >
          <ProCard title="内部卡片标题" type="inner" bordered>
            内部卡片内容
          </ProCard>
          <ProCard title="内部卡片标题" type="inner" bordered>
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
        onClick: ({ commandService }) => {
          console.log(commandService);
        },
        render: () => <Check />,
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
