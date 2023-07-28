import { NsJsonSchemaForm } from "@antv/xflow";

const { ControlShape } = NsJsonSchemaForm;

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
    TaskNode: controlsMainFun(targetData),
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
      name: "label",
      label: "名称",
      shape: ControlShape.INPUT,
      placeholder: "请输入",
      value: targetData?.label,
    },
    {
      name: "importRule",
      label: "入口规则",
      shape: ControlShape.SELECT,
      placeholder: "请选择",
      value: targetData?.importRule,
    },
    {
      name: "exportRule",
      label: "出口规则",
      shape: ControlShape.SELECT,
      placeholder: "请选择",
      value: targetData?.exportRule,
    },
    {
      name: "execution",
      label: "业务执行",
      shape: ControlShape.SELECT,
      placeholder: "请选择",
      value: targetData?.execution,
    },
  ];
};

export { controlsFuc, controlsMainFun };
