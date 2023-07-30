import { NsJsonSchemaForm } from "@antv/xflow";
import { ControlShapeEnum } from "@/components/custom-form";
import { getRulesList } from "./service";

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
    EndNode: [
      {
        name: "label",
        label: "名称",
        shape: ControlShape.INPUT,
        value: targetData?.label,
        placeholder: "请输入",
        disabled: true,
      },
    ],
    ConditionNode: [
      {
        name: "label",
        label: "名称",
        shape: ControlShape.INPUT,
        value: targetData?.label,
        placeholder: "请输入",
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
      name: "label",
      label: "名称",
      shape: ControlShape.INPUT,
      placeholder: "请输入",
      value: targetData?.label,
    },
    {
      name: "importRule",
      label: "入口规则",
      shape: ControlShapeEnum.SELECT_SHAPE,
      placeholder: "请选择",
      value: targetData?.importRule,
      originData: {
        service: async () => {
          const res = await getRulesList({ ruleName: "" });
          return (
            res?.map((item) => ({
              title: item.ruleName,
              value: item.id,
            })) ?? []
          );
        },
      },
    },
    {
      name: "exportRule",
      label: "出口规则",
      shape: ControlShapeEnum.SELECT_SHAPE,
      placeholder: "请选择",
      originData: {
        service: async () => {
          const res = await getRulesList({ ruleName: "" });
          return (
            res?.map((item) => ({
              title: item.ruleName,
              value: item.id,
            })) ?? []
          );
        },
      },
      value: targetData?.exportRule,
    },
    {
      name: "execution",
      label: "业务执行",
      shape: ControlShapeEnum.SELECT_SHAPE,
      placeholder: "请选择",
      options: [
        {
          title: "微服务申请",
          value: "1",
        },
        {
          title: "微服务查询",
          value: "2",
        },
      ],
      value: targetData?.execution,
    },
  ];
};

export { controlsFuc, controlsMainFun };
