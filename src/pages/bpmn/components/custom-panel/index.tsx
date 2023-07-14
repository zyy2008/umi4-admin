import React from "react";
import { WorkspacePanel, IWorkspacePanelProps } from "@antv/xflow";
import { Card, Row } from "antd";
import { useGraphDnd, IOnNodeDrop, IBodyProps } from "@/components/flow";
import Public from "./public";
import Base from "./base";
import Event from "./event";

const CardBody: React.FC<IBodyProps> = (props) => {
  const { onMouseDown } = useGraphDnd(props);
  return (
    <>
      <Base onMouseDown={onMouseDown} />
      <Event onMouseDown={onMouseDown} />
      <Public onMouseDown={onMouseDown} />
    </>
  );
};

const CustomPanel: React.FC<
  IWorkspacePanelProps & {
    onNodeDrop: IOnNodeDrop;
  }
> = (props) => {
  const { onNodeDrop, ...other } = props;
  return (
    <WorkspacePanel {...other}>
      <Card
        size="small"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
        bodyStyle={{
          padding: 0,
          flex: 1,
          overflow: "auto",
        }}
      >
        <CardBody onNodeDrop={onNodeDrop} />
      </Card>
    </WorkspacePanel>
  );
};

export default CustomPanel;
