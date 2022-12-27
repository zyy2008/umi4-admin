import React, { useState, FC } from "react";
import { Button, Space, Tooltip, Upload, message } from "antd";
import { ImportOutlined, ExportOutlined } from "@ant-design/icons";
import { APIS, ViewRelationship } from "@/services";
import { data } from "./mock";

type FileProps = {
  onSuccess?: (T: ViewRelationship[]) => void;
};

const File: FC<FileProps> = (props) => {
  console.log("4444444");
  const { onSuccess } = props;
  const [loading, setLoading] = useState<boolean>(false);
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
              // onError?.(error as any);
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
        <Button icon={<ExportOutlined />} onClick={async () => {}} />
      </Tooltip>
    </Space>
  );
};

export default React.memo(File);
