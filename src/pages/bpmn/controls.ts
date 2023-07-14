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
    StartNode: [
      {
        name: "label",
        label: "名称",
        shape: ControlShape.INPUT,
        value: targetData?.label,
        placeholder: "请输入",
        disabled: true,
      },
    ],
  };
  if (targetData?.renderKey) {
    return ControlRecord[targetData.renderKey];
  }

  return [];
};

const controlsMainFun: (
  targetData: NsJsonSchemaForm.TargetData
) => NsJsonSchemaForm.IControlSchema[] = (targetData) => {
  return [
    {
      name: "name",
      label: "名称",
      shape: ControlShape.INPUT,
      value: targetData?.name,
    },
    {
      name: "importRule",
      label: "入口规则",
      shape: ControlShape.INPUT,
      value: targetData?.importRule,
    },
    {
      name: "exportRule",
      label: "出口规则",
      shape: ControlShape.INPUT,
      value: targetData?.exportRule,
    },
    {
      name: "timeout",
      label: "超时时间",
      shape: ControlShape.FLOAT,
      value: targetData?.timeout,
    },
    {
      name: "info",
      label: "过程信息",
      shape: ControlShape.INPUT,
      value: targetData?.info,
    },
  ];
};

export { controlsFuc, controlsMainFun };
