import type { NsJsonSchemaForm } from "@antv/xflow";
import { EditorShape } from "./custom-editor";
import { LabelShape } from "./custom-label";
import { FormListShape } from "./custom-list";
import { TagsShape } from "./custom-tags";
import { SaveShape } from "./custom-save";
import { NumberShape } from "./custom-number";

/** 自定义form控件 */
export enum ControlShapeEnum {
  EDITOR_SHAPE = "EDITOR",
  TEXT_SHAPE = "TEXT",
  LIST_SHAPE = "LIST",
  TAGS_SHAPE = "SELECT-TAGS",
  SAVE_SHAPE = "SAVE",
  NUMBER_SHAPE = "NUMBER",
}

export const controlMapService: NsJsonSchemaForm.IControlMapService = (
  controlMap
) => {
  controlMap.set(ControlShapeEnum.EDITOR_SHAPE, EditorShape);
  controlMap.set(ControlShapeEnum.TEXT_SHAPE, LabelShape);
  controlMap.set(ControlShapeEnum.LIST_SHAPE, FormListShape);
  controlMap.set(ControlShapeEnum.TAGS_SHAPE, TagsShape);
  controlMap.set(ControlShapeEnum.SAVE_SHAPE, SaveShape);
  controlMap.set(ControlShapeEnum.NUMBER_SHAPE, NumberShape);
  return controlMap;
};
