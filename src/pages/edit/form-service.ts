import {
  NsJsonSchemaForm,
  XFlowNodeCommands,
  XFlowEdgeCommands,
} from "@antv/xflow";
import { set } from "lodash";
import { NsNodeCmd, NsGraph, uuidv4, NsEdgeCmd } from "@antv/xflow";
import { ControlShapeEnum } from "@/components/custom-form";
import type { IModelService, IGraphCommandService } from "@antv/xflow-core";
import type { Cell, Graph as X6Graph, Node } from "@antv/x6";
import { portAttrs } from "@/components/flow";
import { ParamBean } from "@/services";

type IFormSchemaService = (
  args: {
    cell: Cell;
    targetType: NsJsonSchemaForm.TargetType;
    targetData: NsJsonSchemaForm.TargetData;
    modelService: IModelService;
    commandService: IGraphCommandService;
    graph: X6Graph;
  },
  params?: ParamBean[]
) => Promise<NsJsonSchemaForm.ISchema>;

type IFormValueUpdateService = {
  (
    args: {
      values: NsJsonSchemaForm.FieldData[];
      allFields: NsJsonSchemaForm.FieldData[];
      targetType: NsJsonSchemaForm.TargetType;
      targetData: NsJsonSchemaForm.TargetData;
      modelService: IModelService;
      commandService: IGraphCommandService;
    },
    graph?: X6Graph
  ): Promise<any>;
};

export namespace NsJsonForm {
  /** ControlShape的Enum */
  const { ControlShape } = NsJsonSchemaForm;

  /** 保存form的values */
  export const formValueUpdateService: IFormValueUpdateService = async (
    args,
    graph
  ) => {
    const { commandService, targetData: data, allFields } = args;
    const targetData = graph?.getCellById(data?.id as string).getData();
    const updateNode = (node: NsGraph.INodeConfig) => {
      const { label, conditions = [] } = node;
      if (label === "switch") {
        const ports = node.ports as NsGraph.INodeAnchor[];
        const [_, ...others] = ports;
        if (others.length > conditions.length) {
          const [{ id }] = others.filter((_, index) => {
            const is = conditions.some((_: string, i: number) => i === index);
            return !is;
          });
          const cell = graph?.getCellById(data?.id as string);
          const edges = graph?.getOutgoingEdges(cell as Node);
          const [edge] =
            edges?.filter((cell) => {
              const sourcePortId = cell.getSourcePortId();
              return sourcePortId === id;
            }) ?? [];
          const targetCell = edge.getTargetCell() as Node;
          const { ports } = targetCell?.getData();
          ports.forEach((item: any) => {
            targetCell.setPortProp(item?.id, "connected", false);
          });
          const [delEdge] = graph?.getOutgoingEdges(targetCell as Node) ?? [];
          commandService.executeCommand<NsEdgeCmd.DelEdge.IArgs>(
            XFlowEdgeCommands.DEL_EDGE.id,
            {
              edgeConfig: delEdge.getData(),
            }
          );
        }
        const input = ports.filter((item) => item.tooltip === "输入桩");
        node.ports = [
          ...input,
          ...conditions.map((_: any, index: number) => {
            const find = ports.filter(
              (item) => item.tooltip === `输出桩:条件${index + 1}`
            );
            if (find.length > 0) {
              const [item] = find;
              return item;
            }
            return {
              id: uuidv4(),
              type: NsGraph.AnchorType.OUTPUT,
              group: NsGraph.AnchorGroup.BOTTOM,
              tooltip: `输出桩:条件${index + 1}`,
              attrs: portAttrs,
            };
          }),
        ] as NsGraph.INodeAnchor[];
      }
      return commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(
        XFlowNodeCommands.UPDATE_NODE.id,
        {
          nodeConfig: node,
        }
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
  export const formSchemaService: IFormSchemaService = async (args, params) => {
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
            // {
            //   name: "satCode",
            //   label: "卫星名称",
            //   shape: ControlShape.SELECT,
            //   value: targetData.satCode,
            //   placeholder: "请选择",
            //   options: satList,
            // },
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
                  title: "float",
                  value: "float",
                },
                {
                  title: "string",
                  value: "string",
                },
                {
                  title: "boolean",
                  value: "boolean",
                },
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
              value: targetData.timer,
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
              required: true,
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
              shape: ControlShape.FLOAT,
              value: targetData.start,
              placeholder: "请输入",
              required: true,
            },
            {
              name: "end",
              label: "结束条件",
              shape: ControlShape.FLOAT,
              value: targetData.end,
              placeholder: "请输入",
              required: true,
            },
            {
              name: "steps",
              label: "步长",
              shape: ControlShape.FLOAT,
              value: targetData.steps,
              placeholder: "请输入",
              required: true,
            },
            {
              name: "content",
              label: "循环体内容",
              shape: ControlShape.TEXTAREA,
              value: targetData.content,
              placeholder: "请输入",
              required: true,
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
            // {
            //   name: "num",
            //   label: "分支数量",
            //   shape: ControlShape.FLOAT,
            //   value: targetData.num,
            //   placeholder: "请输入",
            // },
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
              name: "funName",
              label: "函数名称",
              shape: ControlShape.INPUT,
              value: targetData.funName,
              disabled: true,
              placeholder: "请输入",
            },
            {
              name: "funContent",
              label: "函数内容",
              shape: ControlShape.TEXTAREA,
              value: targetData.funContent,
            },
          ];
          break;
        case "ProcessNode":
          controls = [
            {
              name: "name",
              label: "变量名称",
              shape: ControlShape.INPUT,
              value: targetData.name,
              placeholder: "请输入",
            },
            {
              name: "expression",
              label: "变量内容",
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
