import React, { useState, FC, InputHTMLAttributes } from "react";
import {
  Button,
  Space,
  Tooltip,
  Upload,
  message,
  Dropdown,
  MenuProps,
} from "antd";
import { ImportOutlined, ExportOutlined } from "@ant-design/icons";
import { APIS, ViewRelationship } from "@/services";
import { BetaSchemaForm } from "@ant-design/pro-components";
import { useModel } from "umi";
import { formatChildren } from "@/utils";
import { ViewHandle } from "./index";
import { data } from "./mock";
import DocConnect from "./doc-connect";

export const fileTypeName = ["本体内容", "技术文档", "预案", "案例"];

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
  const fileRef = React.useRef<any>(null);
  const [key, setKey] = React.useState<string>();
  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (fileRef.current) {
      setKey(key);
      fileRef.current.upload.uploader.onClick({ data: { a: 1 } });
    }
  };
  return (
    <Space>
      <Tooltip placement="top" title="导入知识图谱">
        <Dropdown
          placement="bottom"
          menu={{
            items: fileTypeName.map((val, index) => ({
              label: val,
              key: `${index}`,
            })),
            onClick,
          }}
        >
          <Button icon={<ImportOutlined />} loading={importLoading} />
        </Dropdown>
        <Upload
          ref={fileRef}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          customRequest={async ({ onError, file }) => {
            const hide = message.loading("正在导入...");
            setImportLoading(true);
            try {
              const { success, data = [] } =
                key === "0"
                  ? await APIS.DefaultApi.kmsViewServerViewImportPost({
                      file,
                    })
                  : await APIS.DefaultApi.kmsViewServerDocumentUploadPost({
                      file,
                      fileType: key,
                    });
              if (success) {
                setTimeout(() => {
                  message.success("导入成功！");
                  key === "0" && onSuccess?.(data as ViewRelationship[]);
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
        />
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
          <Tooltip placement="top" title="导出知识图谱">
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
      <DocConnect />
    </Space>
  );
};

export default React.memo(File);
