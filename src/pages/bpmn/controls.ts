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
      name: "entranceRule",
      label: "入口规则",
      shape: ControlShapeEnum.SELECT_SHAPE,
      placeholder: "请选择",
      value: targetData?.entranceRule,
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
      name: "exitRule",
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
      value: targetData?.exitRule,
    },
    {
      name: "microserviceStart",
      label: "业务执行",
      shape: ControlShapeEnum.SELECT_SHAPE,
      placeholder: "请选择",
      options: [
        {
          title: "调度计划生成",
          value: "1",
        },
        {
          title: "低轨资源申请",
          value: "2",
        },
        {
          title: "低轨测控资源修改",
          value: "3",
        },
        {
          title: "低轨轨控策略生成",
          value: "4",
        },
        {
          title: "高轨测控资源申请",
          value: "4",
        },
        {
          title: "控后评估",
          value: "5",
        },
      ],
      originData: {
        mode: "multiple",
        maxTagTextLength: 3,
        maxTagCount: 2,
      },
      value: targetData?.microserviceStart,
    },
  ];
};

export { controlsFuc, controlsMainFun };
