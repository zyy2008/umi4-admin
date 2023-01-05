import React from "react";
import { APIS } from "@/services";
import { Button, Upload, message } from "antd";

const TestExport = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <>
      <button
        onClick={() => {
          APIS.DefaultApi.kmsZsbjServerApiKnowledgeExportPost(
            {
              uuidList: ["318c769c-e024-4426-9f8a-1f5ba4980c03"],
              targetCode: "ZK100",
            },
            {
              responseType: "blob",
            }
          );
        }}
      >
        导出
      </button>
      <Upload
        onChange={(val) => {
          console.log(val);
        }}
        // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        customRequest={async ({ onError, file }) => {
          const hide = message.loading("正在导入...");
          setLoading(true);
          try {
            const { success } =
              await APIS.DefaultApi.kmsZsbjServerApiKnowledgeImportPost({
                file,
                targetCode: "ZK101",
              });
            if (success) {
            } else {
              onError?.("导入失败！" as any);
            }
            hide();
            setLoading(false);
          } catch (error) {
            hide();
            setLoading(false);
          }
        }}
        showUploadList={false}
      >
        <Button loading={loading}>导入</Button>
      </Upload>
    </>
  );
};

export default TestExport;
