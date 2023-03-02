import React from "react";
import type { IConfigRenderOptions } from "@/components/flow";
import { CardListProps, CardList } from "@/components/flow-custom";
import { useRequest } from "@umijs/max";
import { APIS } from "@/services";
import { uuidv4 } from "@antv/xflow";

const TaskList: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const { data = {}, loading } = useRequest(() =>
    APIS.DefaultApi.kmsJobServerCommonTaskPageListPageNumPageSizePost(
      { pageNum: "1", pageSize: "100" },
      { taskName: "", createType: "", taskIdentify: "" }
    )
  );
  const filterData = React.useMemo<CardListProps["dataSource"]>(() => {
    return (data?.records ?? []).map((item) => ({
      data: item,
      nodeType: "COMMON_TASK",
      id: uuidv4(),
      label: item.taskName,
      renderKey: "ProcessNode",
      width: 110,
      height: 45,
    }));
  }, [data]);
  return (
    <CardList
      title="任务"
      height={200}
      dataSource={filterData}
      onMouseDown={onMouseDown}
      loading={loading}
    />
  );
};

export default TaskList;
