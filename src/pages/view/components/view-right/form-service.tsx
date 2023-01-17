import { NsJsonSchemaForm, XFlowNodeCommands } from "@antv/xflow";
import { set, invert } from "lodash";
import type {
  NsNodeCmd,
  NsGraph,
  IModelService,
  IGraphCommandService,
} from "@antv/xflow";
import { message } from "antd";
import { controlShape } from "./components";
import type { Cell, Graph as X6Graph } from "@antv/x6";
import { ControlShapeEnum } from "@/components/custom-form";
import Form from "./form";
import { APIS } from "@/services";

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
    setVisibility?: (T: "hidden" | "visible") => void,
    setDisabled?: (T: boolean) => void
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
  export const formSchemaService: IFormSchemaService = async (
    args,
    setVisibility,
    setDisabled
  ) => {
    const { targetData, targetType } = args;
    if (!targetData || targetType === "edge") {
      setVisibility?.("hidden");
      setDisabled?.(true);
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
      let controls: NsJsonSchemaForm.IControlSchema[] & { [key: string]: any };
      let disabled: boolean = false;
      let shape: string = ControlShapeEnum.SAVE_SHAPE;
      const { fill } = targetData;
      if (controlShapeInvert[fill] === "3") {
        setDisabled?.(false);
        disabled = true;
        shape = ControlShape.INPUT;
      } else {
        setDisabled?.(true);
      }

      setVisibility?.("visible");
      controls = [
        {
          name: "label",
          label: "节点名称",
          shape,
          value: targetData.label,
          placeholder: "请输入",
          disabled,
          onClick: async ({
            value,
            onChange,
          }: {
            value: string;
            onChange: (T: string) => void;
          }) => {
            const { id } = targetData;
            const { success } =
              await APIS.DefaultApi.kmsViewServerViewEditorPost(
                {
                  id,
                  newName: value,
                },
                { prefix: "/atlas" }
              );
            if (success) {
              message.success("修改成功！");
              onChange?.(value);
            } else {
              message.warning("修改失败！");
            }
          },
        },
      ];
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

  export const getCustomRenderComponent: NsJsonSchemaForm.ICustomRender = (
    targetType,
    targetData
  ) => {
    console.log(targetType, targetData);
    if (targetType === "node") {
      return Form;
    }

    return null;
  };
}
