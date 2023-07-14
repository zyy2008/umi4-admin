import { NsJsonSchemaForm, XFlowNodeCommands } from "@antv/xflow";
import { set } from "lodash";
import { NsNodeCmd, NsGraph, uuidv4 } from "@antv/xflow";
import type { IModelService, IGraphCommandService } from "@antv/xflow-core";
import type { Cell, Graph as X6Graph, Node } from "@antv/x6";
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
    args
  ) => {
    const { commandService, targetData, allFields } = args;
    const updateNode = (node: NsGraph.INodeConfig) => {
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
  export const formSchemaService: IFormSchemaService = async (args) => {
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
