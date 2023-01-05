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
    console.log(args);
    if (!targetData || targetType === "edge") {
      return {
        tabs: [
          {
            /** Tab的title */
            name: "属性",
            groups: [
              {
                name: "dag",
                controls: [
                  {
                    name: "dagId",
                    label: "dagId",
                    shape: ControlShape.INPUT,
                    defaultValue: "pyfuntion_operator",
                  },
                  {
                    name: "cron",
                    label: "cron",
                    shape: ControlShape.INPUT,
                    defaultValue: " 0***",
                  },
                  {
                    name: "startDate",
                    label: "startDate",
                    shape: ControlShape.DATETIME,
                    defaultValue: "2022-10-11",
                  },
                  {
                    name: "timeZone",
                    label: "timeZone",
                    shape: ControlShape.SELECT,
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
                    label: "timeZone",
                    shape: ControlShape.SELECT,
                    defaultValue: "python",
                    options: [
                      {
                        title: "python",
                        value: "python",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
    }
    const { renderKey } = targetData;
    const groups: () => NsJsonSchemaForm.IGroup[] = () => {
      let controls: NsJsonSchemaForm.IControlSchema[];
      switch (renderKey) {
        case "ProcessNode":
          controls = [
            {
              name: "label",
              label: "名称",
              shape: ControlShape.INPUT,
              value: targetData.label,
              disabled: true,
            },
            {
              name: "input",
              label: "输入",
              shape: ControlShape.INPUT,
              value: targetData.input,
            },
            {
              name: "output",
              label: "输出",
              shape: ControlShape.INPUT,
              value: targetData.output,
            },
            {
              name: "dataSource",
              label: "数据来源",
              shape: ControlShape.SELECT,
              value: targetData.dataSource,
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
              value: targetData.dataGo,
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
