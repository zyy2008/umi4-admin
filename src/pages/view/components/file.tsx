import React, { useState, FC } from "react";
import { Button, Space, Tooltip, Upload, message } from "antd";
import { ImportOutlined, ExportOutlined } from "@ant-design/icons";
import { APIS, ViewRelationship } from "@/services";
import { NsGraphCmd, XFlowGraphCommands } from "@antv/xflow";
import { BetaSchemaForm } from "@ant-design/pro-components";
import { formatChildren } from "@/utils";
import { ViewHandle } from "./index";
import { data } from "./mock";

type FileProps = {
  onSuccess?: (T: ViewRelationship[]) => void;
  leftRef: React.RefObject<ViewHandle>;
};

type DataItem = {
  satelliteCode: string;
};

const File: FC<FileProps> = (props) => {
  const { onSuccess, leftRef } = props;
  const [importLoading, setImportLoading] = useState<boolean>(false);
  // React.useEffect(() => {
  //   const app = leftRef.current?.app;
  //   if (app) {
  //     (async () => {
  //       const graph = await app.getGraphInstance();
  //       // graph.toggleMultipleSelection(false);
  //       graph.on("node:selected", ({ node: { id } }) => {
  //         app.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
  //           XFlowGraphCommands.SAVE_GRAPH_DATA.id,
  //           {
  //             saveGraphDataService: async (meta, data) => {
  //               const { edges } = data;
  //               const find = formatChildren(id, edges);
  //               const targets = find.map(({ target }) => target);
  //               graph.select(targets);
  //               setDisabled(false);
  //             },
  //           }
  //         );
  //       });
  //       graph.on("node:unselected", () => {
  //         setDisabled(true);
  //       });
  //     })();
  //   }
  // }, [leftRef.current]);
  return (
    <Space>
      <Tooltip placement="bottom" title="导入知识图谱">
        <Upload
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          customRequest={async ({ onError, file }) => {
            const hide = message.loading("正在导入...");
            setImportLoading(true);
            try {
              const { success, data = [] } =
                await APIS.DefaultApi.kmsViewServerViewImportPost(
                  {
                    file,
                  }
                  // { prefix: "/atlas" }
                );
              if (success) {
                setTimeout(() => {
                  message.success("导入成功！");
                  onSuccess?.(data);
                }, 100);
              } else {
                onError?.("导入失败！" as any);
                setTimeout(() => {
                  message.warning("导入失败！");
                }, 1000);
              }
              hide();
              setImportLoading(false);
            } catch (error) {
              hide();
              setImportLoading(false);
              message.warning("导入失败！");
            }
          }}
          showUploadList={false}
        >
          <Button icon={<ImportOutlined />} loading={importLoading} />
        </Upload>
      </Tooltip>
      <BetaSchemaForm<DataItem>
        onFinish={async ({ satelliteCode }) => {
          const hide = message.loading("正在导出...");
          try {
            const res = await APIS.DefaultApi.kmsViewServerViewExportPost(
              {
                satelliteCode,
              },
              {
                responseType: "blob",
                // prefix: "/atlas",
              }
            );
            hide();
            if (res) {
              return true;
            }
            return false;
          } catch (error) {
            hide();
            return false;
          }
        }}
        trigger={
          <Tooltip placement="bottom" title="导出知识图谱">
            <Button icon={<ExportOutlined />} />
          </Tooltip>
        }
        layoutType="ModalForm"
        title="卫星选择"
        layout="horizontal"
        width="600px"
        columns={[
          {
            title: "卫星",
            dataIndex: "satelliteCode",
            valueType: "select",
            request: async () => {
              try {
                const { success, data = [] } =
                  await APIS.DefaultApi.baseServerDataQueryQuerySatListGet();

                return success ?? false
                  ? data.map(({ satCode, satName }) => ({
                      label: satName,
                      value: satCode,
                    }))
                  : [
                      {
                        label: "xx_55",
                        value: "xx_55",
                      },
                    ];
              } catch (error) {
                return [
                  {
                    label: "xx_55",
                    value: "xx_55",
                  },
                ];
              }
            },
            formItemProps: {
              style: {
                width: "100%",
              },
              rules: [
                {
                  required: true,
                },
              ],
            },
          },
        ]}
      />
    </Space>
  );
};

export default React.memo(File);
