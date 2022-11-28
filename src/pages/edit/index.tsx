import { JsonSchemaForm } from "@antv/xflow";
import KnowledgeFlow from "@/components/flow";
import { NsJsonForm } from "./form-service";
import { CustomPanel, controlMapService } from "./components";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { useToolbarConfig } from "./toolbar-config";

const Edit = () => {
  const toolbarConfig = useToolbarConfig();
  return (
    <KnowledgeFlow
      toolbarProps={{
        config: toolbarConfig,
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
  );
};
export default Edit;
