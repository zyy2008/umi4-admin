import { NsJsonSchemaForm, XFlowNodeCommands } from "@antv/xflow";
import { set, invert } from "lodash";
import type {
  NsNodeCmd,
  NsGraph,
  IModelService,
  IGraphCommandService,
} from "@antv/xflow";
import { controlShape } from "./components";
import { Form, Input } from "antd";
import type { Cell, Graph as X6Graph } from "@antv/x6";
import { CallbackType } from "./index";

export interface IFormSchemaService {
  (
    args: {
      cell: Cell;
      targetType: NsJsonSchemaForm.TargetType;
      targetData: NsJsonSchemaForm.TargetData;
      modelService: IModelService;
      commandService: IGraphCommandService;
      graph: X6Graph;
    },
    cb: CallbackType
  ): Promise<NsJsonSchemaForm.ISchema>;
}

const controlShapeInvert = invert(controlShape);

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
  export const formSchemaService: IFormSchemaService = async (args, cb) => {
    const { targetData, targetType } = args;
    if (!targetData || targetType === "edge") {
      cb("hidden");
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
    const groups: () => NsJsonSchemaForm.IGroup[] = () => {
      let controls: NsJsonSchemaForm.IControlSchema[];
      const { fill } = targetData;
      if (controlShapeInvert[fill] === "parameter") {
        cb("visible");
        controls = [
          {
            name: "name",
            label: "节点名称",
            shape: ControlShape.INPUT,
            value: targetData.name,
            placeholder: "请输入",
          },
        ];
        return [
          {
            name: "more",
            controls,
          },
        ];
      }
      return [];
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
