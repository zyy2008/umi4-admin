import {
  NsJsonSchemaForm,
  XFlowNodeCommands,
  XFlowGraphCommands,
  MODELS,
} from "@antv/xflow";
import { set } from "lodash";
import type { NsNodeCmd, NsGraph, NsGraphCmd } from "@antv/xflow";
import { ControlShapeEnum } from "@/components/custom-form";
import controlsFuc from "./controls";

export namespace NsJsonForm {
  /** ControlShape的Enum */
  const { ControlShape } = NsJsonSchemaForm;

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
        console.log(meta);
        updateMeta(meta);
      }
    };

  /** 根据选中的节点更新formSchema */
  export const formSchemaService: NsJsonSchemaForm.IFormSchemaService = async (
    args
  ) => {
    const { targetData, targetType, modelService } = args;
    const { meta } = await MODELS.GRAPH_META.useValue(modelService);
    const controls = controlsFuc(targetData, meta);
    if (!targetData || targetType === "edge") {
      return {
        tabs: [
          {
            /** Tab的title */
            name: "属性",
            groups: [
              {
                name: "dag",
                controls,
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
              controls,
            },
          ],
        },
      ],
    };
  };
}
