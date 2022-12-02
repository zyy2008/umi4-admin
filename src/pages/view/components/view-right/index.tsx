import ViewFlow from "@/components/flow";
import * as dndPanelConfig from "@/components/flow/config-dnd-panel";
import { CustomPanel } from "./components";

const ViewRight = () => {
  return (
    <ViewFlow position={{ left: 160, right: 0 }} connectionType="one-to-many">
      <CustomPanel
        position={{ width: 160, top: 0, bottom: 0, left: 0 }}
        onNodeDrop={dndPanelConfig.onNodeDrop}
      />
    </ViewFlow>
  );
};

export default ViewRight;
