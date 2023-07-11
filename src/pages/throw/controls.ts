import { NsJsonSchemaForm } from "@antv/xflow";
import { ControlShapeEnum } from "@/components/custom-form";

const { ControlShape } = NsJsonSchemaForm;

export const returnType = ["int", "float", "string", "boolean", "void"];

const formatSelect: { title: string; value: string | number | boolean }[] =
  returnType.map((val, index) => ({ title: val, value: index + 1 }));

const controlsFuc: (
  targetData: NsJsonSchemaForm.TargetData
) => NsJsonSchemaForm.IControlSchema[] = (targetData) => {
  const ControlRecord: Record<string, NsJsonSchemaForm.IControlSchema[]> = {
    StartProcessNode: [
      {
        name: "label",
        label: "知识名称",
        shape: ControlShape.INPUT,
        value: targetData?.label,
        placeholder: "请输入",
      },
    ],
    ProcessNode: [
      {
        name: "name",
        label: "变量名称",
        shape: ControlShape.INPUT,
        value: targetData?.name,
        placeholder: "请输入",
        required: true,
      },
      {
        name: "type",
        label: "变量类型",
        shape: ControlShape.SELECT,
        value: targetData?.type,
        options: formatSelect,
        placeholder: "请输入",
        required: true,
      },
      {
        name: "explanation",
        label: "变量说明",
        shape: ControlShape.INPUT,
        value: targetData?.explanation,
        placeholder: "请输入",
      },
      {
        name: "expression",
        label: "变量内容",
        shape: ControlShapeEnum.EDITOR_SHAPE,
        value: targetData?.expression,
        required: true,
      },
    ],
  };
  if (targetData?.renderKey) {
    return ControlRecord[targetData.renderKey];
  }

  return [];
};

export default controlsFuc;
