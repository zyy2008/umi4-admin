import { APIS } from "@/services";

const TestExport = () => {
  return (
    <>
      <button
        onClick={() => {
          APIS.DefaultApi.kmsZsbjServerApiKnowledgeExportPost({
            uuidList: ["318c769c-e024-4426-9f8a-1f5ba4980c03"],
            targetCode: "ZK100",
          }).then((res) => {
            console.log(res);
          });
        }}
      >
        导出
      </button>
      <button
        onClick={() => {
          console.log("导入");
        }}
      >
        导入
      </button>
    </>
  );
};

export default TestExport;
