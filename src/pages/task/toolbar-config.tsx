import type { IToolbarItemOptions, IToolbarGroupOptions } from "@antv/xflow";
import { createToolbarConfig } from "@antv/xflow";
import { XFlowGraphCommands, IconStore } from "@antv/xflow";
import { SaveOutlined, CheckOutlined, CodeOutlined } from "@ant-design/icons";
import type { NsGraphCmd } from "@antv/xflow";
import { message } from "antd";
import {
  APIS,
  ParamskmsJobServerCommonTaskFlowTaskIdPut,
  ParamsBodykmsJobServerCommonTaskPost,
} from "@/services";
import { useSearchParams } from "@umijs/max";

namespace NsConfig {
  /** 注册icon 类型 */
  IconStore.set("SaveOutlined", SaveOutlined);
  IconStore.set("CheckOutlined", CheckOutlined);
  IconStore.set("CodeOutlined", CodeOutlined);
  /** 获取toobar配置项 */
  export const getToolbarItems: (
    T: any
  ) => Promise<IToolbarGroupOptions[]> = async (value) => {
    const toolbarGroup1: IToolbarItemOptions[] = [
      {
        id: XFlowGraphCommands.SAVE_GRAPH_DATA.id,
        iconName: "SaveOutlined",
        tooltip: "保存数据",
        onClick: async ({ commandService }) => {
          commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
            XFlowGraphCommands.SAVE_GRAPH_DATA.id,
            {
              saveGraphDataService: async (graphMeta, data) => {
                const { meta } = graphMeta;
                if (value) {
                  let object: ParamskmsJobServerCommonTaskFlowTaskIdPut &
                    ParamsBodykmsJobServerCommonTaskPost;
                  try {
                    object = JSON.parse(value);
                  } catch (error) {
                    object = null as any;
                    console.error("地址传参格式异常，请检查！");
                  }
                  if (object && object?.taskId) {
                    const { success } =
                      await APIS.DefaultApi.kmsJobServerCommonTaskFlowTaskIdPut(
                        { taskId: object.taskId },
                        {
                          ...object,
                          dagJson: JSON.stringify({
                            ...data,
                            dag: meta,
                          }),
                        }
                      );
                    if (success) {
                      message.success("修改成功！");
                    } else {
                      message.warning("修改失败！");
                    }
                  } else {
                    const { success } =
                      await APIS.DefaultApi.kmsJobServerCommonTaskPost({
                        ...object,
                        dagJson: JSON.stringify(data),
                      });
                    if (success) {
                      message.success("新增成功！");
                    } else {
                      message.warning("新增失败！");
                    }
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
export const useToolbarConfig = () => {
  const [searchParams] = useSearchParams();
  const object = searchParams.get("object");

  return createToolbarConfig((toolbarConfig) => {
    /** 生产 toolbar item */
    toolbarConfig.setToolbarModelService(async (toolbarModel) => {
      const toolbarItems = await NsConfig.getToolbarItems(object);
      toolbarModel.setValue((toolbar) => {
        toolbar.mainGroups = toolbarItems;
      });
    });
  })();
};
