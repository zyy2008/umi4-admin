import React, { useState, FC } from "react";
import { Button, Space, Tooltip, Upload, message } from "antd";
import { ImportOutlined, ExportOutlined } from "@ant-design/icons";
import { APIS, ViewRelationship } from "@/services";
import { BetaSchemaForm } from "@ant-design/pro-components";
import { useModel } from "umi";
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
  const { onSuccess } = props;
  const { initialState, loading } = useModel("@@initialState");
  const { satList } = initialState ?? {};
  const [importLoading, setImportLoading] = useState<boolean>(false);
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
                await APIS.DefaultApi.kmsViewServerViewImportPost({
                  file,
                });
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
        modalProps={{
          maskClosable: false,
        }}
        layoutType="ModalForm"
        title="卫星选择"
        layout="horizontal"
        width="600px"
        columns={[
          {
            title: "卫星",
            dataIndex: "satelliteCode",
            valueType: "select",
            fieldProps: {
              options: satList,
              loading,
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
