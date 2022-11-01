import type { IToolbarItemOptions, IToolbarGroupOptions } from "@antv/xflow";
import { createToolbarConfig } from "@antv/xflow";
import { XFlowGraphCommands, XFlowNodeCommands, IconStore } from "@antv/xflow";
import {
  SaveOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import type { NsGraphCmd, NsNodeCmd } from "@antv/xflow";

namespace NsConfig {
  /** 注册icon 类型 */
  IconStore.set("PlusCircleOutlined", PlusCircleOutlined);
  IconStore.set("DeleteOutlined", DeleteOutlined);
  IconStore.set("SaveOutlined", SaveOutlined);
  /** 获取toobar配置项 */
  export const getToolbarItems: () => Promise<
    IToolbarGroupOptions[]
  > = async () => {
    const toolbarGroup: IToolbarItemOptions[] = [
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

    return [{ name: "nodeGroup", items: toolbarGroup }];
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
