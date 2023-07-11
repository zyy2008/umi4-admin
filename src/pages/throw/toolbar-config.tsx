import React from "react";
import type {
  IToolbarItemOptions,
  IToolbarGroupOptions,
  NsGraphCmd,
} from "@antv/xflow";
import {
  createToolbarConfig,
  MODELS,
  XFlowGraphCommands,
  IconStore,
} from "@antv/xflow";
import {
  SaveOutlined,
  CheckOutlined,
  CodeOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { DataUri, Graph } from "@antv/x6";

namespace NsConfig {
  /** 注册icon 类型 */
  IconStore.set("SaveOutlined", SaveOutlined);
  IconStore.set("CheckOutlined", CheckOutlined);
  IconStore.set("CodeOutlined", CodeOutlined);
  IconStore.set("CameraOutlined", CameraOutlined);
  /** 获取toobar配置项 */
  export const getToolbarItems: () => Promise<
    IToolbarGroupOptions[]
  > = async () => {
    const toolbarGroup1: IToolbarItemOptions[] = [
      {
        id: "CameraOutlined ",
        iconName: "CameraOutlined",
        tooltip: "截图",
        onClick: async ({ modelService }) => {
          const res = await MODELS.GRAPH_META.useValue(modelService);
          const graph: Graph = await res.getX6Graph();
          graph.toPNG(
            async (dataUri) => {
              DataUri.downloadDataUri(dataUri, "chart.png");
            },
            {
              backgroundColor: "rgba(0, 0, 0, 0)",
              copyStyles: true,
              quality: 1,
              width: 1920,
              height: 1080,
            }
          );
        },
      },
      {
        id: XFlowGraphCommands.SAVE_GRAPH_DATA.id,
        iconName: "SaveOutlined",
        tooltip: "保存数据",
        onClick: async ({ commandService }) => {
          commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
            XFlowGraphCommands.SAVE_GRAPH_DATA.id,
            {
              saveGraphDataService: async (meta, data) => {},
            }
          );
        },
      },
    ];

    return [{ name: "nodeGroup", items: toolbarGroup1 }];
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
