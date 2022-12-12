import { NsJsonSchemaForm, XFlowNodeCommands } from "@antv/xflow";
import { set } from "lodash";
import type { NsNodeCmd, NsGraph } from "@antv/xflow";
import { ControlShapeEnum } from "@/components/custom-form";

export namespace NsJsonForm {
  /** ControlShape的Enum */
  const { ControlShape } = NsJsonSchemaForm;

  /** 保存form的values */
  export const formValueUpdateService: NsJsonSchemaForm.IFormValueUpdateService =
    async (args) => {
      const { commandService, targetData, allFields } = args;
      const updateNode = (node: NsGraph.INodeConfig) => {
        return commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(
          XFlowNodeCommands.UPDATE_NODE.id,
          { nodeConfig: node }
        );
      };
      const nodeConfig: NsGraph.INodeConfig = {
        id: "",
        ...targetData,
      };
      allFields.forEach((val) => {
        set(nodeConfig, val.name, val.value);
      });
      updateNode(nodeConfig);
    };

  /** 根据选中的节点更新formSchema */
  export const formSchemaService: NsJsonSchemaForm.IFormSchemaService = async (
    args
  ) => {
    const { targetData, targetType } = args;
    if (!targetData || targetType === "edge") {
      return {
        tabs: [
          {
            /** Tab的title */
            name: "属性",
            groups: [],
          },
        ],
      };
    }
    const { renderKey } = targetData;
    const groups: () => NsJsonSchemaForm.IGroup[] = () => {
      let controls: NsJsonSchemaForm.IControlSchema[];
      switch (renderKey) {
        case "ConnectorNode":
          controls = [
            {
              name: "label",
              label: "参数名称",
              shape: ControlShape.INPUT,
              value: targetData.label,
              disabled: true,
            },
            {
              name: "type",
              label: "参数类型",
              shape: ControlShape.SELECT,
              value: targetData.type,
              placeholder: "请选择",
              options: [
                {
                  title: "int",
                  value: "int",
                },
                {
                  title: "string",
                  value: "string",
                },
              ],
            },
          ];
          break;
        case "RectNode":
          controls = [
            {
              name: "label",
              label: "事实名称",
              shape: ControlShape.INPUT,
              value: targetData.label,
              disabled: true,
            },
            {
              name: "version",
              label: "事实版本",
              shape: ControlShape.INPUT,
              value: targetData.version,
              disabled: true,
            },
            {
              name: "type",
              label: "事实类型",
              shape: ControlShape.SELECT,
              value: targetData.type,
              placeholder: "请选择",
              options: [
                {
                  title: "int",
                  value: "int",
                },
                {
                  title: "string",
                  value: "string",
                },
              ],
            },
          ];
          break;
        case "DecisionNode":
          controls = [
            {
              name: "name",
              label: "条件名称",
              shape: ControlShape.INPUT,
              value: targetData.name,
              placeholder: "请输入",
            },
            {
              name: "expression",
              label: "表达式编辑",
              shape: ControlShapeEnum.EDITOR_SHAPE,
              value: targetData.expression,
            },
          ];
          break;
        case "DataIONode":
          controls = [
            {
              name: "i",
              label: "变量名",
              shape: ControlShapeEnum.TEXT_SHAPE,
            },
            {
              name: "start",
              label: "开始条件",
              shape: ControlShape.INPUT,
              value: targetData.start,
              placeholder: "请输入",
            },
            {
              name: "end",
              label: "结束条件",
              shape: ControlShape.INPUT,
              value: targetData.end,
              placeholder: "请输入",
            },
            {
              name: "steps",
              label: "步长",
              shape: ControlShape.INPUT,
              value: targetData.steps,
              placeholder: "请输入",
            },
            {
              name: "content",
              label: "循环体内容",
              shape: ControlShape.TEXTAREA,
              value: targetData.content,
              placeholder: "请输入",
            },
          ];
          break;
        case "SectorNode":
          controls = [
            {
              name: "name",
              label: "条件名称",
              shape: ControlShape.INPUT,
              value: targetData.name,
              placeholder: "请输入",
            },
            {
              name: "num",
              label: "分支数量",
              shape: ControlShape.FLOAT,
              value: targetData.num,
              placeholder: "请输入",
            },
            {
              name: "var",
              label: "分支变量",
              shape: ControlShape.SELECT,
              value: targetData.var,
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
              value: targetData.type,
              placeholder: "请选择",
              options: [
                {
                  title: "int",
                  value: "int",
                },
                {
                  title: "string",
                  value: "string",
                },
              ],
            },
            {
              name: "conditions",
              label: "分支条件",
              shape: ControlShapeEnum.LIST_SHAPE,
              value: targetData.conditions,
              placeholder: "请输入",
            },
          ];
          break;
        case "ManualOperationNode":
          controls = [
            {
              name: "name",
              label: "条件名称",
              shape: ControlShape.INPUT,
              value: targetData.name,
              placeholder: "请输入",
            },
            {
              name: "expression",
              label: "表达式编辑",
              shape: ControlShapeEnum.EDITOR_SHAPE,
              value: targetData.expression,
            },
          ];
          break;
        //自定义
        case "EllipseNode":
          controls = [
            {
              name: "name",
              label: "函数名称",
              shape: ControlShape.INPUT,
              value: targetData.name,
              placeholder: "请输入",
            },
            {
              name: "content",
              label: "函数内容",
              shape: ControlShape.TEXTAREA,
              value: targetData.content,
            },
          ];
          break;
        case "PreparationNode":
          controls = [
            {
              name: "name",
              label: "事实名称",
              shape: ControlShape.INPUT,
              value: targetData.name,
              placeholder: "请输入",
            },
            {
              name: "source",
              label: "来源类型",
              shape: ControlShape.SELECT,
              value: targetData.source,
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
              value: targetData.content,
            },
            {
              name: "getStatus",
              label: "获取方式",
              shape: ControlShape.SELECT,
              value: targetData.getStatus,
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
              value: targetData.address,
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
          ];
          break;
        case "MultiDocumentNode":
          controls = [
            {
              name: "name",
              label: "函数名称",
              shape: ControlShape.INPUT,
              value: targetData.name,
              placeholder: "请输入",
            },
            {
              name: "content",
              label: "函数内容",
              shape: ControlShape.TEXTAREA,
              value: targetData.content,
            },
          ];
          break;
        default:
          return [];
      }
      return [
        {
          name: "more",
          controls,
        },
      ];
    };

    return {
      /** 配置一个Tab */
      tabs: [
        {
          /** Tab的title */
          name: "节点配置",
          groups: groups(),
        },
      ],
    };
  };
}
