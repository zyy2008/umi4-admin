import { NsJsonSchemaForm, XFlowNodeCommands } from "@antv/xflow";
import { set } from "lodash";
import { NsNodeCmd, NsGraph, uuidv4 } from "@antv/xflow";
import type { IModelService, IGraphCommandService } from "@antv/xflow-core";
import type { Cell, Graph as X6Graph, Node } from "@antv/x6";
import { portAttrs } from "@/components/flow";
import { ParamBean } from "@/services";
import controlsFuc from "./controls";

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
  /** 保存form的values */
  export const formValueUpdateService: IFormValueUpdateService = async (
    args,
    graph
  ) => {
    const { commandService, targetData: data, allFields } = args;
    const targetData = graph?.getCellById(data?.id as string).getData();
    const updateNode = (node: NsGraph.INodeConfig) => {
      const { label, conditions = [] } = node;
      console.log(node);
      if (label === "switch") {
        const ports = node.ports as NsGraph.INodeAnchor[];
        const [top, left, ...others] = ports;
        if (others.length > conditions.length) {
          const [{ id }] = others.filter((_, index) => {
            const is = conditions.some((_: string, i: number) => i === index);
            return !is;
          });
          const cell = graph?.getCellById(data?.id as string);
          const edges = graph?.getOutgoingEdges(cell as Node);
          if (edges) {
            const [edge] =
              edges.filter((cell) => {
                const sourcePortId = cell.getSourcePortId();
                return sourcePortId === id;
              }) ?? [];
            const targetCell = edge.getTargetCell() as Node;
            edge.remove();
            targetCell.remove();
          }
        }
        node.ports = [
          top,
          left,
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

    return {
      /** 配置一个Tab */
      tabs: [
        {
          /** Tab的title */
          name: "节点配置",
          groups: [
            {
              name: "more",
              controls: controlsFuc(targetData),
            },
          ],
        },
      ],
    };
  };
}
