import type { NsGraph } from "@antv/xflow";
import type { NsNodeCmd, NsEdgeCmd } from "@antv/xflow";
import type { IMenuOptions } from "@antv/xflow";
import { createCtxMenuConfig } from "@antv/xflow";
import { MenuItemType } from "@antv/xflow";
import { IconStore, XFlowNodeCommands, XFlowEdgeCommands } from "@antv/xflow";
import {
  DeleteOutlined,
  EditOutlined,
  StopOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import type { IProps } from "./index";

/** menuitem 配置 */
export namespace NsCustomMenuItems {
  /** 注册菜单依赖的icon */
  IconStore.set("DeleteOutlined", DeleteOutlined);
  IconStore.set("EditOutlined", EditOutlined);
  IconStore.set("StopOutlined", StopOutlined);
  IconStore.set("SaveOutlined", SaveOutlined);

  export const DELETE_EDGE: IMenuOptions = {
    id: XFlowEdgeCommands.DEL_EDGE.id,
    label: "删除边",
    hotkey: "Delete",
    iconName: "DeleteOutlined",
    onClick: async ({ target, commandService }) => {
      commandService.executeCommand<NsEdgeCmd.DelEdge.IArgs>(
        XFlowEdgeCommands.DEL_EDGE.id,
        {
          edgeConfig: target.data as NsGraph.IEdgeConfig,
        }
      );
    },
  };

  export const DELETE_NODE: IMenuOptions = {
    id: XFlowNodeCommands.DEL_NODE.id,
    label: "删除节点",
    iconName: "DeleteOutlined",
    hotkey: "Delete",
    onClick: async ({ target, commandService }) => {
      commandService.executeCommand<NsNodeCmd.DelNode.IArgs>(
        XFlowNodeCommands.DEL_NODE.id,
        {
          nodeConfig: { id: target?.data?.id as string },
        }
      );
    },
  };

  export const EMPTY_MENU: IMenuOptions = {
    id: "EMPTY_MENU_ITEM",
    label: "暂无可用",
    isEnabled: false,
    iconName: "DeleteOutlined",
    onClick: async ({ target, commandService }) => {
      commandService.executeCommand<NsNodeCmd.DelNode.IArgs>(
        XFlowNodeCommands.DEL_NODE.id,
        {
          nodeConfig: { id: target?.data?.id as string },
        }
      );
    },
  };

  export const SAVE_MENU: IMenuOptions = {
    id: "SAVE_MENU_ITEM",
    label: "保存事件",
    iconName: "SaveOutlined",
    onClick: async ({ target, commandService }) => {},
  };

  export const SEPARATOR: IMenuOptions = {
    id: "separator",
    type: MenuItemType.Separator,
  };
}

export const useMenuConfig = createCtxMenuConfig<IProps>((config, proxy) => {
  const { menuDisabled = [] } = proxy.getValue();
  config.setMenuModelService(async (data, model) => {
    let { type, cell } = data ?? {};
    const { renderKey } = cell?.getData();
    const is =
      menuDisabled.includes(type ?? "null") || menuDisabled.includes(renderKey);
    if (is) {
      type = "blank";
    }
    switch (type) {
      case "node":
        const submenu: () => IMenuOptions[] = () => {
          if (renderKey === "TaskNode") {
            return [NsCustomMenuItems.SAVE_MENU];
          }
          return [];
        };

        model.setValue({
          id: "root",
          type: MenuItemType.Root,
          submenu: [NsCustomMenuItems.DELETE_NODE, ...submenu()],
        });
        break;
      case "edge":
        model.setValue({
          id: "root",
          type: MenuItemType.Root,
          submenu: [NsCustomMenuItems.DELETE_EDGE],
        });
        break;
      case "blank":
        model.setValue({
          id: "root",
          type: MenuItemType.Root,
          submenu: [NsCustomMenuItems.EMPTY_MENU],
        });
        break;
      default:
        model.setValue({
          id: "root",
          type: MenuItemType.Root,
          submenu: [NsCustomMenuItems.EMPTY_MENU],
        });
        break;
    }
  });
});
