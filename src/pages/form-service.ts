import { NsJsonSchemaForm, XFlowNodeCommands } from "@antv/xflow";
import { set } from "lodash";
import type { NsNodeCmd, NsGraph } from "@antv/xflow";
import { ControlShapeEnum } from "./components";

export namespace NsJsonForm {
  /** ControlShape的Enum */
  const { ControlShape } = NsJsonSchemaForm;

  /** 保存form的values */
  export const formValueUpdateService: NsJsonSchemaForm.IFormValueUpdateService =
    async (args) => {
      const { values, commandService, targetData } = args;
      const updateNode = (node: NsGraph.INodeConfig) => {
        return commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(
          XFlowNodeCommands.UPDATE_NODE.id,
          { nodeConfig: node }
        );
      };
      console.log("formValueUpdateService  values:", values, args);
      const nodeConfig: NsGraph.INodeConfig = {
        id: "",
        ...targetData,
      };
      values.forEach((val) => {
        set(nodeConfig, val.name, val.value);
      });
      updateNode(nodeConfig);
    };

  /** 根据选中的节点更新formSchema */
  export const formSchemaService: NsJsonSchemaForm.IFormSchemaService = async (
    args
  ) => {
    const { targetData } = args;
    console.log(`formSchemaService args:`, args);
    if (!targetData) {
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
            },
            {
              name: "expression",
              label: "表达式编辑",
              shape: ControlShapeEnum.EDITOR_SHAPE,
              value: targetData.expression,
            },
          ];
          break;
        default:
          return [];
      }
      return [
        {
          name: "1",
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
