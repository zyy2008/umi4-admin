import React from "react";
import TaskFlow from "@/components/flow";
import { CustomPanel } from "./components";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { JsonSchemaForm, NsGraph } from "@antv/xflow";
import { controlMapService } from "@/components/custom-form";
import { NsJsonForm } from "./form-service";
import { useToolbarConfig } from "./toolbar-config";
import { useSearchParams, useRequest } from "@umijs/max";
import { APIS } from "@/services";
import { Cell } from "@antv/x6";

const Task = () => {
  const [searchParams] = useSearchParams();
  const object = searchParams.get("object");
  const toolbarConfig = useToolbarConfig(object);
  const { data, loading, run } = useRequest(
    (taskId) => APIS.DefaultApi.kmsJobServerCommonTaskTaskIdGet({ taskId }),
    { manual: true }
  );
  React.useEffect(() => {
    if (object) {
      const { taskId }: { taskId: string } = JSON.parse(object ?? "");
      taskId && run(taskId);
    }
  }, [object]);

  const graphData = React.useMemo<NsGraph.IGraphData>(() => {
    return {
      nodes: [],
      edges: [],
    };
  }, [data]);
  return (
    <TaskFlow
      toolbarProps={{
        config: toolbarConfig,
      }}
      graphData={graphData}
      connectionType="many-to-many"
      graphOptions={(opt) => {
        return {
          ...opt,
          connecting: {
            ...opt.connecting,
            validateConnection: function (args) {
              const {
                sourceView,
                targetView,
                sourceMagnet,
                targetMagnet,
                targetCell,
                sourceCell,
              } = args;
              // 不允许连接到自己
              if (sourceView === targetView) {
                return false;
              }
              if (!sourceMagnet || !targetMagnet) {
                return false;
              }

              // if (
              //   this?.isPredecessor(sourceCell as Cell, targetCell as Cell) ||
              //   this.isSuccessor(sourceCell as Cell, targetCell as Cell)
              // ) {
              //   return false;
              // }
              // const cells = this.getNeighbors(targetCell as Cell, {
              //   incoming: true,
              //   outgoing: true,
              //   deep: true,
              // });

              // console.log(cells);

              return true;
            },
          },
        };
      }}
    >
      <>
        <CustomPanel
          position={{ width: 260, top: 0, bottom: 0, left: 0 }}
          onNodeDrop={dndPanelConfig.onNodeDrop}
        />
        <JsonSchemaForm
          targetType={["node", "edge", "canvas"]}
          position={{ top: 0, bottom: 0, right: 0, width: 290 }}
          footerPosition={{
            height: 0,
          }}
          headerPosition={{
            height: 0,
          }}
          formSchemaService={NsJsonForm.formSchemaService}
          formValueUpdateService={NsJsonForm.formValueUpdateService}
          controlMapService={controlMapService}
        />
      </>
    </TaskFlow>
  );
};

export default Task;
