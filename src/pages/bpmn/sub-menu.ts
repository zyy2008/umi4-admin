import { IMenuOptions } from "@antv/xflow";

const SAVE_MENU: IMenuOptions = {
  id: "SAVE_MENU_ITEM",
  label: "保存事件",
  iconName: "SaveOutlined",
  hotkey: "SaveEvent",
  onClick: async ({ target, commandService }) => {},
};

export const nodeSubmenu: (T: string) => IMenuOptions[] = (renderKey) => {
  if (renderKey === "TaskNode") {
    return [SAVE_MENU];
  }
  return [];
};
