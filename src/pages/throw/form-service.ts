import { NsJsonSchemaForm, XFlowNodeCommands, MODELS } from "@antv/xflow";
import { set } from "lodash";
import {
  NsNodeCmd,
  NsGraph,
  NsGraphCmd,
  XFlowGraphCommands,
} from "@antv/xflow";
import type { IModelService, IGraphCommandService } from "@antv/xflow-core";
import type { Cell, Graph as X6Graph, Node } from "@antv/x6";
import { ParamBean } from "@/services";
import controlsFuc from "./controls";

const { ControlShape } = NsJsonSchemaForm;

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

export namespace NsJsonForm {
  /** 保存form的values */
  export const formValueUpdateService: NsJsonSchemaForm.IFormValueUpdateService =
    async (args) => {
      const {
        commandService,
        targetData,
        allFields,
        targetType,
        modelService,
      } = args;
      if (targetType === "node") {
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
      }

      if (targetType === "canvas") {
        const updateMeta = (meta: NsGraph.IGraphMeta) => {
          return commandService.executeCommand<NsGraphCmd.GraphMeta.IArgs>(
            XFlowGraphCommands.LOAD_META.id,
            { meta: meta }
          );
        };
        const { meta } = await MODELS.GRAPH_META.useValue(modelService);
        allFields.forEach((val) => {
          set(meta, val.name, val.value);
        });
        updateMeta(meta);
      }
    };

  /** 根据选中的节点更新formSchema */
  export const formSchemaService: IFormSchemaService = async (args) => {
    const { targetData, targetType, modelService } = args;

    if (!targetData || targetType === "edge") {
      const { meta } = await MODELS.GRAPH_META.useValue(modelService);
      return {
        tabs: [
          {
            /** Tab的title */
            name: "属性",
            groups: [
              {
                name: "more",
                controls: [
                  {
                    name: "name",
                    label: "流程名称",
                    shape: ControlShape.INPUT,
                    value: meta?.name,
                    placeholder: "请输入流程名称",
                    required: true,
                  },
                  {
                    name: "satCode",
                    label: "卫星",
                    shape: ControlShape.SELECT,
                    value: meta?.satCode,
                    placeholder: "请选择配置卫星",
                    required: true,
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
