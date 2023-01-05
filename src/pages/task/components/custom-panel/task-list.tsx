import React from "react";
import type { IConfigRenderOptions } from "@/components/flow";
import { CardListDisabled, CardListProps } from "@/components/flow-custom";
import { useRequest } from "@umijs/max";
import { APIS } from "@/services";
import { uuidv4 } from "@antv/xflow";

const TaskList: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const { data = {}, loading } = useRequest(() =>
    APIS.DefaultApi.kmsJobServerCommonTaskPageListPageNumPageSizePost(
      { pageNum: "1", pageSize: "10" },
      { taskName: "", createType: "", taskIdentify: "" }
    )
  );
  const filterData = React.useMemo<CardListProps["dataSource"]>(() => {
    return (data?.records ?? []).map((item) => ({
      ...item,
      id: uuidv4(),
      label: item.taskName,
      renderKey: "ProcessNode",
      width: 110,
      height: 45,
    }));
  }, [data]);
  return (
    <CardListDisabled
      title="任务"
      dataSource={filterData}
      onMouseDown={onMouseDown}
      loading={loading}
    />
  );
};

export default TaskList;
