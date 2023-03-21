import { NsJsonSchemaForm } from "@antv/xflow";
import { ControlShapeEnum } from "@/components/custom-form";

const { ControlShape } = NsJsonSchemaForm;

const returnType = ["int", "float", "string", "boolean", "void"];

const formatSelect: { title: string; value: string | number | boolean }[] =
  returnType.map((val, index) => ({ title: val, value: index }));

const controlsFuc: (
  targetData: NsJsonSchemaForm.TargetData
) => NsJsonSchemaForm.IControlSchema[] = (targetData) => {
  const ControlRecord: Record<string, NsJsonSchemaForm.IControlSchema[]> = {
    ConnectorNode: [
      {
        name: "label",
        label: "参数名称",
        shape: ControlShape.INPUT,
        value: targetData?.label,
        disabled: true,
      },
      {
        name: "type",
        label: "参数类型",
        shape: ControlShape.SELECT,
        value: targetData?.type,
        placeholder: "请选择",
        options: formatSelect,
      },
      // {
      //   name: "satCode",
      //   label: "卫星名称",
      //   shape: ControlShape.SELECT,
      //   value: targetData.satCode,
      //   placeholder: "请选择",
      //   options: satList,
      // },
    ],
    RectNode: [
      {
        name: "label",
        label: "事实名称",
        shape: ControlShape.INPUT,
        value: targetData?.label,
        disabled: true,
      },
      {
        name: "version",
        label: "事实版本",
        shape: ControlShape.INPUT,
        value: targetData?.version,
        disabled: true,
      },
      {
        name: "type",
        label: "事实类型",
        shape: ControlShape.SELECT,
        value: targetData?.type,
        placeholder: "请选择",
        options: [
          ...formatSelect,
          {
            title: "时间序列",
            value: "时间序列",
          },
        ],
      },
      {
        name: "timer",
        label: "时间",
        shape: ControlShapeEnum.NUMBER_SHAPE,
        value: targetData?.timer,
        hidden: true,
        placeholder: "请输入",
        originData: {
          addonAfter: "秒",
          min: 0,
        },
        dependencies: [
          {
            name: "type",
            condition: "时间序列",
            hidden: false,
          },
        ],
      },
      // {
      //   name: "param",
      //   label: "参数",
      //   shape: ControlShape.SELECT,
      //   value: targetData.param,
      //   placeholder: "请输入",
      //   options: params?.map((item) => ({
      //     title: "1",
      //     value: item.satSid,
      //   })),
      // },
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
        required: true,
      },
    ],
    DataIONode: [
      {
        name: "i",
        label: "变量名",
        shape: ControlShapeEnum.TEXT_SHAPE,
      },
      {
        name: "start",
        label: "开始条件",
        shape: ControlShape.FLOAT,
        value: targetData?.start,
        placeholder: "请输入",
        required: true,
      },
      {
        name: "end",
        label: "结束条件",
        shape: ControlShape.FLOAT,
        value: targetData?.end,
        placeholder: "请输入",
        required: true,
      },
      {
        name: "steps",
        label: "步长",
        shape: ControlShape.FLOAT,
        value: targetData?.steps,
        placeholder: "请输入",
        required: true,
      },
      {
        name: "content",
        label: "循环体内容",
        shape: ControlShape.TEXTAREA,
        value: targetData?.content,
        placeholder: "请输入",
        required: true,
      },
    ],
    SectorNode: [
      {
        name: "name",
        label: "条件名称",
        shape: ControlShape.INPUT,
        value: targetData?.name,
        placeholder: "请输入",
      },
      {
        name: "var",
        label: "分支变量",
        shape: ControlShape.SELECT,
        value: targetData?.var,
        placeholder: "请选择",
        options: [
          {
            title: "参数1",
            value: "参数1",
          },
          {
            title: "参数2",
            value: "参数2",
          },
        ],
      },
      {
        name: "type",
        label: "变量类型",
        shape: ControlShape.SELECT,
        value: targetData?.type,
        placeholder: "请选择",
        options: formatSelect,
      },
      {
        name: "conditions",
        label: "分支条件",
        shape: ControlShapeEnum.LIST_SHAPE,
        value: targetData?.conditions,
        placeholder: "请输入",
      },
    ],
    ManualOperationNode: [
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
    EllipseNode: [
      {
        name: "name",
        label: "函数名称",
        shape: ControlShape.INPUT,
        value: targetData?.name,
        placeholder: "请输入",
      },
      {
        name: "content",
        label: "函数内容",
        shape: ControlShape.TEXTAREA,
        value: targetData?.content,
      },
    ],
    PreparationNode: [
      {
        name: "name",
        label: "事实名称",
        shape: ControlShape.INPUT,
        value: targetData?.name,
        placeholder: "请输入",
      },
      {
        name: "source",
        label: "来源类型",
        shape: ControlShape.SELECT,
        value: targetData?.source,
        options: [
          {
            title: "内部",
            value: true,
          },
          {
            title: "外部",
            value: false,
          },
        ],
        placeholder: "请选择",
        defaultValue: true,
      },
      {
        name: "content",
        label: "事实内容",
        shape: ControlShape.TEXTAREA,
        value: targetData?.content,
      },
      {
        name: "getStatus",
        label: "获取方式",
        shape: ControlShape.SELECT,
        value: targetData?.getStatus,
        options: [
          {
            title: "UDP",
            value: "UDP",
          },
          {
            title: "TCP",
            value: "TCP",
          },
          {
            title: "WebService",
            value: "WebService",
          },
        ],
        placeholder: "请选择",
        dependencies: [
          {
            name: "source",
            condition: true,
            hidden: true,
          },
          {
            name: "source",
            condition: false,
            hidden: false,
          },
        ],
      },
      {
        name: "address",
        label: "获取地址",
        shape: ControlShape.INPUT,
        value: targetData?.address,
        dependencies: [
          {
            name: "source",
            condition: true,
            hidden: true,
          },
          {
            name: "source",
            condition: false,
            hidden: false,
          },
        ],
      },
    ],
    MultiDocumentNode: [
      {
        name: "name",
        label: "变量名称",
        shape: ControlShape.INPUT,
        value: targetData?.name,
        placeholder: "请输入",
        disabled: targetData?.returnType === 5,
      },
      {
        name: "funName",
        label: "函数名称",
        shape: ControlShape.INPUT,
        value: targetData?.funName,
        disabled: true,
        placeholder: "请输入",
      },
      {
        name: "paramValues",
        label: "函数参数",
        shape: ControlShapeEnum.MULTI_INPUT_SHAPE,
        value: targetData?.paramNote?.map((_: any, index: number) => {
          return targetData?.paramValues?.[index];
        }),

        placeholder: "请选择",
        required: true,
        originData: {
          paramNote: targetData?.paramNote,
        },
      },
      {
        name: "funContent",
        label: "函数内容",
        shape: ControlShape.TEXTAREA,
        value: targetData?.funContent,
      },
      {
        name: "returnType",
        label: "返回类型",
        shape: ControlShape.SELECT,
        options: formatSelect,
        value: targetData?.returnType,
        disabled: true,
      },
      {
        name: "returnNote",
        label: "返回说明",
        shape: ControlShape.TEXTAREA,
        value: targetData?.returnNote,
        disabled: true,
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
        name: "expression",
        label: "变量内容",
        shape: ControlShapeEnum.EDITOR_SHAPE,
        value: targetData?.expression,
        required: true,
      },
    ],
    StartNode: [
      {
        name: "label",
        label: "知识名称",
        shape: ControlShape.INPUT,
        value: targetData?.label,
        placeholder: "请输入",
        disabled: true,
      },
      // {
      //   name: "input",
      //   label: "输入",
      //   shape: ControlShapeEnum.LIST_TABLE_SHAPE,
      //   value: targetData?.input,
      //   placeholder: "请输入",
      // },
    ],
  };
  if (targetData?.renderKey) {
    return ControlRecord[targetData.renderKey];
  }

  return [];
};

export default controlsFuc;
