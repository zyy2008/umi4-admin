import { NsJsonSchemaForm } from "@antv/xflow";
import { ControlShapeEnum } from "@/components/custom-form";

const { ControlShape } = NsJsonSchemaForm;

const controlsFuc: (
  targetData: NsJsonSchemaForm.TargetData
) => NsJsonSchemaForm.IControlSchema[] = (targetData) => {
  const NodeSchema: NsJsonSchemaForm.IControlSchema[] = [
    {
      name: "label",
      label: "名称",
      shape: ControlShape.INPUT,
      value: targetData?.label,
      placeholder: "请输入",
    },
    {
      name: "expression",
      label: "规则",
      shape: ControlShapeEnum.EDITOR_SHAPE,
      value: targetData?.expression,
      originData: {
        isRadio: false,
      },
    },
  ];
  const ControlRecord: Record<string, NsJsonSchemaForm.IControlSchema[]> = {
    StartProcessNode: [
      {
        name: "label",
        label: "名称",
        shape: ControlShape.INPUT,
        value: targetData?.label,
        placeholder: "请输入",
      },
    ],
    ProcessNode: [
      {
        name: "label",
        label: "名称",
        shape: ControlShape.INPUT,
        value: targetData?.label,
        placeholder: "请输入",
      },
      {
        name: "soft",
        label: "辅助软件",
        shape: ControlShape.INPUT,
        value: targetData?.soft,
        placeholder: "请输入",
      },
      {
        name: "deal",
        label: "处置方案",
        shape: ControlShape.TEXTAREA,
        value: targetData?.deal,
        placeholder: "请输入",
      },
      {
        name: "condition",
        label: "判断条件",
        shape: ControlShape.SELECT,
        options: [
          {
            title: "与",
            value: 0,
          },
          {
            title: "或",
            value: 1,
          },
        ],
        value: targetData?.condition,
        placeholder: "请选择子节点判断元素关系",
      },
      {
        name: "text",
        label: "文本",
        shape: ControlShape.TEXTAREA,
        value: targetData?.text,
        placeholder: "请输入",
      },
      {
        name: "images",
        label: "图片",
        shape: ControlShapeEnum.UPLOAD_SHAPE,
        value: targetData?.images,
        originData: {
          accept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
        },
        placeholder: "请输入",
      },
      {
        name: "files",
        label: "文件",
        shape: ControlShapeEnum.UPLOAD_SHAPE,
        value: targetData?.files,
        originData: {
          listType: "text",
          accept:
            "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
        placeholder: "请输入",
      },
      {
        name: "urls",
        label: "网址",
        shape: ControlShapeEnum.LIST_SHAPE,
        value: targetData?.urls,
        placeholder: "请输入",
      },
    ],
    ConnectorNode: NodeSchema,
    SquareNode: NodeSchema,
  };
  if (targetData?.renderKey) {
    return ControlRecord[targetData.renderKey];
  }

  return [];
};

export default controlsFuc;
