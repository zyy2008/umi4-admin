import React from "react";
import type {
  IToolbarItemOptions,
  IToolbarGroupOptions,
  NsGraphCmd,
} from "@antv/xflow";
import {
  createToolbarConfig,
  MODELS,
  XFlowGraphCommands,
  IconStore,
} from "@antv/xflow";
import {
  SaveOutlined,
  CheckOutlined,
  CodeOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { DataUri, Graph } from "@antv/x6";
import { Modal } from "antd";
import { APIS, Knowledge } from "@/services";
import { useSearchParams } from "@umijs/max";
import { CheckContext, Context } from "./index";
import { CheckItem, CheckCode } from "./components";

const ModalItem: React.FC<{
  modalRender?: React.ReactNode;
  tooltip?: string;
}> = (props) => {
  const { tooltip, modalRender, children } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const ctx = React.useContext(Context);
  const disabled = React.useMemo<boolean>(() => {
    if (ctx?.state) {
      return !ctx?.state.uuid && !ctx?.state.version;
    }
    return true;
  }, [ctx?.state]);

  return (
    <>
      {!disabled && (
        <div
          className="x6-toolbar-item xflow-toolbar-item"
          style={{
            padding: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
          onClick={() => setOpen(true)}
        >
          {children}
        </div>
      )}

      <Modal
        title={tooltip}
        open={open}
        onCancel={() => setOpen(false)}
        width="800px"
      >
        {modalRender}
      </Modal>
    </>
  );
};

namespace NsConfig {
  /** 注册icon 类型 */
  IconStore.set("SaveOutlined", SaveOutlined);
  IconStore.set("CheckOutlined", CheckOutlined);
  IconStore.set("CodeOutlined", CodeOutlined);
  IconStore.set("CameraOutlined", CameraOutlined);
  /** 获取toobar配置项 */
  export const getToolbarItems: (
    T: any,
    S: CheckContext["setState"]
  ) => Promise<IToolbarGroupOptions[]> = async (value, set) => {
    const toolbarGroup1: IToolbarItemOptions[] = [
      {
        id: "CameraOutlined ",
        iconName: "CameraOutlined",
        tooltip: "截图",
        onClick: async ({ modelService }) => {
          const res = await MODELS.GRAPH_META.useValue(modelService);
          const graph: Graph = await res.getX6Graph();
          graph.toPNG(
            async (dataUri) => {
              DataUri.downloadDataUri(dataUri, "chart.png");
            },
            {
              backgroundColor: "rgba(0, 0, 0, 0)",
              copyStyles: true,
              quality: 1,
              width: 1920,
              height: 1080,
            }
          );
        },
      },
      {
        id: "CheckOutlined",
        iconName: "CheckOutlined",
        tooltip: "知识校验",
        render: (props) => <ModalItem modalRender={<CheckItem />} {...props} />,
      },
      {
        id: "CodeOutlined",
        iconName: "CodeOutlined",
        tooltip: "查看代码",
        render: (props) => <ModalItem modalRender={<CheckCode />} {...props} />,
      },
      {
        id: XFlowGraphCommands.SAVE_GRAPH_DATA.id,
        iconName: "SaveOutlined",
        tooltip: "保存数据",
        onClick: async ({ commandService }) => {
          commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
            XFlowGraphCommands.SAVE_GRAPH_DATA.id,
            {
              saveGraphDataService: async (meta, data) => {
                if (value) {
                  let object: Knowledge & {
                    type: string;
                    grade: number;
                    delay: number;
                    partSystem: string;
                    component: string;
                  };
                  try {
                    object = JSON.parse(value);
                  } catch (error) {
                    object = null as any;
                    console.error("地址传参格式异常，请检查！");
                  }
                  if (object?.uuid) {
                    const { success } =
                      await APIS.DefaultApi.kmsZsbjServerApiKnowledgeUpdatePut({
                        ...object,
                        uuid: object?.uuid,
                        createType: object?.type,
                        faultLevel: object?.grade,
                        faultDelay: object?.delay,
                        subsystem: object?.partSystem,
                        faultPart: object?.component,
                        graphInfo: JSON.stringify(data),
                      });

                    window.parent.postMessage(
                      {
                        type: "update",
                        message: success,
                      },
                      "*"
                    );
                  } else {
                    const { success } =
                      await APIS.DefaultApi.kmsZsbjServerApiKnowledgeAddPost({
                        ...object,
                        createType: object?.type ?? "",
                        faultLevel: object?.grade,
                        faultDelay: object?.delay,
                        subsystem: object?.partSystem,
                        faultPart: object?.component,
                        graphInfo: JSON.stringify(data),
                      });
                    if (success) {
                      set({
                        uuid: "566ed986-e3c1-4c9c-af5b-f3353d5bcfe9",
                        version: "1.0.0",
                      });
                    }
                    window.parent.postMessage(
                      {
                        type: "add",
                        message: success,
                      },
                      "*"
                    );
                  }
                }
              },
            }
          );
        },
      },
    ];

    return [{ name: "nodeGroup", items: toolbarGroup1 }];
  };
}

/** wrap出一个hook */
export const useToolbarConfig = (set: CheckContext["setState"]) => {
  const [searchParams] = useSearchParams();
  const object = searchParams.get("object");
  React.useEffect(() => {
    if (object) {
      let format: any;
      try {
        format = JSON.parse(object);
      } catch (error) {
        format = {};
        console.error("地址传参格式异常，请检查！");
      }
      if (format?.uuid && format?.version) {
        const { uuid, version } = format;
        set({
          uuid,
          version,
        });
      }
    }
  }, [object]);
  return createToolbarConfig((toolbarConfig) => {
    /** 生产 toolbar item */
    toolbarConfig.setToolbarModelService(async (toolbarModel) => {
      const toolbarItems = await NsConfig.getToolbarItems(object, set);
      toolbarModel.setValue((toolbar) => {
        toolbar.mainGroups = toolbarItems;
      });
    });
  })();
};
