import {
  NsJsonSchemaForm,
  XFlowNodeCommands,
  XFlowEdgeCommands,
} from "@antv/xflow";
import { set } from "lodash";
import { NsNodeCmd, NsGraph, NsEdgeCmd } from "@antv/xflow";
import type { IModelService, IGraphCommandService } from "@antv/xflow-core";
import type { Cell, Graph as X6Graph, Node } from "@antv/x6";
import { ParamBean } from "@/services";
import { controlsFuc, controlsMainFun } from "./controls";

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
    const updateEdge = (edge: NsGraph.IEdgeConfig) => {
      return commandService.executeCommand<NsEdgeCmd.UpdateEdge.IArgs>(
        XFlowEdgeCommands.UPDATE_EDGE.id,
        { edgeConfig: edge, options: {} }
      );
    };
    const updateNode = (node: NsGraph.INodeConfig) => {
      return commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(
        XFlowNodeCommands.UPDATE_NODE.id,
        {
          nodeConfig: node,
        }
      );
    };
    const data = {
      ...targetData,
    };
    allFields.forEach((val) => {
      set(data, val.name, val.value);
    });
    if (args.targetType === "edge") {
      updateEdge(data as NsGraph.IEdgeConfig);
    } else if (args.targetType === "node") {
      updateNode(data as NsGraph.INodeConfig);
    }
  };

  /** 根据选中的节点更新formSchema */
  export const formSchemaService: IFormSchemaService = async (args) => {
    const { targetData, targetType } = args;
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

    if (targetType === "edge") {
      console.log(targetData);
      return {
        tabs: [
          {
            /** Tab的title */
            name: "边配置",
            groups: [
              {
                name: "more",
                controls: [
                  {
                    name: "label",
                    label: "名称",
                    shape: "input",
                    value: targetData?.label,
                    placeholder: "请输入",
                  },
                ],
              },
            ],
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
