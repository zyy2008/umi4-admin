import React from "react";
import { JsonSchemaForm } from "@antv/xflow";
import KnowledgeFlow from "@/components/flow";
import { NsJsonForm } from "./form-service";
import { CustomPanel } from "./components";
import { controlMapService } from "@/components/custom-form";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { useToolbarConfig } from "./toolbar-config";

export type Check = { uuid: string; version: string } | null;

export type CheckContext = {
  state: Check;
  setState: React.Dispatch<React.SetStateAction<Check | null>>;
};
export const Context = React.createContext<CheckContext | null>(null);

const Edit = () => {
  const [state, setState] = React.useState<Check>({
    uuid: "",
    version: "",
  });
  const toolbarConfig = useToolbarConfig(setState);
  return (
    <Context.Provider value={{ state, setState }}>
      <KnowledgeFlow
        toolbarProps={{
          config: toolbarConfig,
        }}
        cardProps={{
          title: "知识编辑器",
        }}
      >
        <>
          <CustomPanel
            position={{ width: 260, top: 0, bottom: 0, left: 0 }}
            onNodeDrop={dndPanelConfig.onNodeDrop}
          />

          <JsonSchemaForm
            targetType={["node", "edge", "canvas"]}
            controlMapService={controlMapService}
            formSchemaService={NsJsonForm.formSchemaService}
            formValueUpdateService={NsJsonForm.formValueUpdateService}
            position={{ top: 0, bottom: 0, right: 0, width: 290 }}
            footerPosition={{
              height: 0,
            }}
          />
        </>
      </KnowledgeFlow>
    </Context.Provider>
  );
};
export default Edit;
