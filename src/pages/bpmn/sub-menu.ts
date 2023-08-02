import { IMenuOptions } from "@antv/xflow";
import { eventToolsSave } from "./service";
import { message } from "antd";
import { EventEmitter } from "ahooks/lib/useEventEmitter";

export const nodeSubmenu: (
  T: string,
  event$?: EventEmitter<string>
) => IMenuOptions[] = (renderKey, event$) => {
  if (renderKey === "TaskNode") {
    return [
      {
        id: "SAVE_MENU_ITEM",
        label: "保存事件",
        iconName: "SaveOutlined",
        hotkey: "SaveEvent",
        onClick: async ({ target, commandService }) => {
          const { data } = target;
          const hide = message.loading("保存中...");
          const res = await eventToolsSave({
            toolId: data?.id,
            toolName: data?.label,
            toolData: JSON.stringify({
              taskType: "highResultRecv",
              entranceRule: data?.entranceRule ?? "",
              exitRule: data?.exitRule ?? "",
              microserviceStart: data?.microserviceStart ?? [],
            }),
          });
          hide();
          if (res === "success") {
            message.success("保存成功");
            event$?.emit("event");
          } else {
            message.warning("保存失败");
          }
        },
      },
    ];
  }
  return [];
};
