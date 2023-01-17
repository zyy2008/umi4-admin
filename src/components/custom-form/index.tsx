import type { NsJsonSchemaForm } from "@antv/xflow";
import { EditorShape } from "./custom-editor";
import { LabelShape } from "./custom-label";
import { FormListShape } from "./custom-list";
import { TagsShape } from "./custom-tags";
import { SaveShape } from "./custom-save";

/** 自定义form控件 */
export enum ControlShapeEnum {
  EDITOR_SHAPE = "EDITOR",
  TEXT_SHAPE = "TEXT",
  LIST_SHAPE = "LIST",
  TAGS_SHAPE = "SELECT-TAGS",
  SAVE_SHAPE = "SAVE",
}

export const controlMapService: NsJsonSchemaForm.IControlMapService = (
  controlMap
) => {
  controlMap.set(ControlShapeEnum.EDITOR_SHAPE, EditorShape);
  controlMap.set(ControlShapeEnum.TEXT_SHAPE, LabelShape);
  controlMap.set(ControlShapeEnum.LIST_SHAPE, FormListShape);
  controlMap.set(ControlShapeEnum.TAGS_SHAPE, TagsShape);
  controlMap.set(ControlShapeEnum.SAVE_SHAPE, SaveShape);
  return controlMap;
};
