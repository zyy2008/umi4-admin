import React from "react";
import TaskFlow from "@/components/flow";
import { CustomPanel } from "./components";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { JsonSchemaForm } from "@antv/xflow";
import { NsJsonForm } from "./form-service";

const Task = () => {
  return (
    <TaskFlow>
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
        />
      </>
    </TaskFlow>
  );
};

export default Task;
