import type { NsJsonSchemaForm } from "@antv/xflow";
import { EditorShape } from "./custom-editor";
import { LabelShape } from "./custom-label";
import { FormListShape } from "./custom-list";

/** 自定义form控件 */
export enum ControlShapeEnum {
  EDITOR_SHAPE = "EDITOR",
  TEXT_SHAPE = "TEXT",
  LIST_SHAPE = "LIST",
}

export const controlMapService: NsJsonSchemaForm.IControlMapService = (
  controlMap
) => {
  controlMap.set(ControlShapeEnum.EDITOR_SHAPE, EditorShape);
  controlMap.set(ControlShapeEnum.TEXT_SHAPE, LabelShape);
  controlMap.set(ControlShapeEnum.LIST_SHAPE, FormListShape);
  return controlMap;
};
