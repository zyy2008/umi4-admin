import React, { useState, FC } from "react";
import { Button, Space, Tooltip, Upload, message } from "antd";
import { ImportOutlined, ExportOutlined } from "@ant-design/icons";
import { APIS, ViewRelationship } from "@/services";
import { NsGraphCmd, XFlowGraphCommands } from "@antv/xflow";
import { formatChildren } from "@/utils";
import { ViewHandle } from "./index";
import { data } from "./mock";

type FileProps = {
  onSuccess?: (T: ViewRelationship[]) => void;
  leftRef: React.RefObject<ViewHandle>;
};

const File: FC<FileProps> = (props) => {
  const { onSuccess, leftRef } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  React.useEffect(() => {
    const app = leftRef.current?.app;
    if (app) {
      (async () => {
        const graph = await app.getGraphInstance();
        // graph.toggleMultipleSelection(false);
        graph.on("node:selected", ({ node: { id } }) => {
          app.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
            XFlowGraphCommands.SAVE_GRAPH_DATA.id,
            {
              saveGraphDataService: async (meta, data) => {
                const { edges } = data;
                const find = formatChildren(id, edges);
                const targets = find.map(({ target }) => target);
                graph.select(targets);
                setDisabled(false);
              },
            }
          );
        });
        graph.on("node:unselected", () => {
          setDisabled(true);
        });
      })();
    }
  }, [leftRef.current]);
  return (
    <Space>
      <Tooltip placement="bottom" title="导入知识图谱">
        <Upload
          onChange={(val) => {
            console.log(val);
          }}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          customRequest={async ({ onError, file }) => {
            const hide = message.loading("正在导入...");
            setLoading(true);
            try {
              const { success } = await APIS.DefaultApi.viewImportPost({
                file,
              });
              if (success) {
                onSuccess?.(data);
              } else {
                onError?.("导入失败！" as any);
              }
              hide();
              setLoading(false);
            } catch (error) {
              onSuccess?.(data);
              hide();
              setLoading(false);
            }
          }}
          showUploadList={false}
        >
          <Button icon={<ImportOutlined />} loading={loading} />
        </Upload>
      </Tooltip>
      <Tooltip placement="bottom" title="导出知识图谱">
        <Button
          icon={<ExportOutlined />}
          disabled={disabled}
          onClick={async () => {
            const app = leftRef.current?.app;
            if (app) {
              const graph = await app.getGraphInstance();
              const cells = graph.getSelectedCells();
              console.log(cells);
            }
          }}
        />
      </Tooltip>
    </Space>
  );
};

export default React.memo(File);
