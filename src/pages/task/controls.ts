import { NsJsonSchemaForm } from "@antv/xflow";
import { ControlShapeEnum } from "@/components/custom-form";

const { ControlShape } = NsJsonSchemaForm;

const returnType = ["int", "float", "string", "boolean", "void"];

const formatSelect: { title: string; value: string | number | boolean }[] =
  returnType.map((val, index) => ({ title: val, value: index + 1 }));

const controlsFuc: (
  targetData: NsJsonSchemaForm.TargetData,
  meta?: any
) => NsJsonSchemaForm.IControlSchema[] = (targetData, meta) => {
  const ControlRecord: Record<string, NsJsonSchemaForm.IControlSchema[]> = {
    ProcessNode: [
      {
        name: "label",
        label: "名称",
        shape: ControlShape.INPUT,
        value: targetData?.label,
        disabled: true,
      },
      {
        name: "input",
        label: "输入",
        shape: ControlShape.INPUT,
        value: targetData?.input,
      },
      {
        name: "output",
        label: "输出",
        shape: ControlShape.INPUT,
        value: targetData?.output,
      },
      {
        name: "dataSource",
        label: "数据来源",
        shape: ControlShape.SELECT,
        value: targetData?.dataSource,
        options: [
          {
            title: "kafka",
            value: "kafka",
          },
          {
            title: "udp",
            value: "udp",
          },
          {
            title: "mysql",
            value: "mysql",
          },
          {
            title: "hbase",
            value: "hbase",
          },
        ],
      },
      {
        name: "dataGo",
        label: "数据去向",
        shape: ControlShape.SELECT,
        value: targetData?.dataGo,
        options: [
          {
            title: "mysql",
            value: "mysql",
          },
          {
            title: "hbase",
            value: "hbase",
          },
          {
            title: "txt",
            value: "txt",
          },
        ],
      },
    ],
    DecisionNode: [
      {
        name: "name",
        label: "条件名称",
        shape: ControlShape.INPUT,
        value: targetData?.name,
        placeholder: "请输入",
      },
      {
        name: "expression",
        label: "表达式编辑",
        shape: ControlShapeEnum.EDITOR_SHAPE,
        value: targetData?.expression,
      },
    ],
  };
  if (targetData?.renderKey) {
    return ControlRecord[targetData.renderKey];
  }

  if (meta) {
    return [
      {
        name: "dagId",
        label: "dagId",
        shape: ControlShape.INPUT,
        value: meta?.dagId,
        defaultValue: "pyfuntion_operator",
      },
      {
        name: "cron",
        label: "cron",
        shape: ControlShape.INPUT,
        value: meta?.cron,
        defaultValue: "0***",
      },
      {
        name: "startDate",
        label: "startDate",
        shape: ControlShape.DATETIME,
        value: meta?.startDate,
        defaultValue: "2022-10-11",
      },
      {
        name: "timeZone",
        label: "timeZone",
        shape: ControlShape.SELECT,
        value: meta?.timeZone,
        defaultValue: "UTC",
        options: [
          {
            title: "UTC",
            value: "UTC",
          },
        ],
      },
      {
        name: "tags",
        label: "tags",
        shape: ControlShapeEnum.SELECT_SHAPE,
        value: meta?.tags,
        defaultValue: ["python"] as any,
        originData: {
          mode: "tags",
        },
        options: [
          {
            title: "python",
            value: "python",
          },
        ],
      },
    ];
  }

  return [];
};

export default controlsFuc;
