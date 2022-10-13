import React from "react";
import { WorkspacePanel, IWorkspacePanelProps, uuidv4 } from "@antv/xflow";
import { NsGraph, IGraphConfig } from "@antv/xflow-core";
import { Card, CardProps, Space, Input, List, Row, Col, Empty } from "antd";
import VirtualList from "rc-virtual-list";
import { useGraphDnd, IPanelNode } from "./dnd-hook";
import type { IOnNodeDrop } from "./interface";
import {
  DecisionNode,
  DataIONode,
  TerminalNode,
  ConnectorNode,
} from "../nodes";
import "./index.less";

const { Search } = Input;

type CardListProps = {
  title?: string;
  dataSource: IPanelNode[];
  loading?: boolean;
  onMouseDown: (
    nodeConfig: NsGraph.INodeConfig
  ) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

interface IConfigRenderOptions {
  graphConfig?: IGraphConfig;
  onMouseDown: (
    nodeConfig: NsGraph.INodeConfig
  ) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const CardList: React.FC<CardListProps> = (props) => {
  const { dataSource, title, onMouseDown, loading } = props;
  const [keyword, setKeyword] = React.useState<string>("");
  const filterData = React.useMemo<IPanelNode[]>(() => {
    const list = dataSource.filter((node) => node.label?.includes(keyword));
    return list;
  }, [dataSource, keyword]);
  return (
    <List
      loading={loading}
      dataSource={[]}
      header={
        <Row align="middle" justify="center">
          <Col span={4}>{title}</Col>
          <Col span={19}>
            <Search onSearch={setKeyword} allowClear placeholder="过滤条件" />
          </Col>
        </Row>
      }
    >
      {filterData.length > 0 ? (
        <VirtualList
          data={filterData}
          height={200}
          itemHeight={36}
          itemKey="id"
        >
          {(item) => (
            <List.Item onMouseDown={onMouseDown(item)} className="node-list">
              {item.label}
            </List.Item>
          )}
        </VirtualList>
      ) : (
        <Empty
          style={{
            height: 200,
          }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </List>
  );
};

const BaseNode: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  return (
    <Row>
      <Col
        span={12}
        onMouseDown={onMouseDown({
          id: uuidv4(),
          renderKey: "DecisionNode",
          label: "if",
        })}
      >
        {React.createElement(DecisionNode)}
      </Col>
      <Col
        span={12}
        onMouseDown={onMouseDown({ id: uuidv4(), renderKey: "DataIONode" })}
      >
        {React.createElement(DataIONode)}
      </Col>
      <Col
        span={12}
        onMouseDown={onMouseDown({ id: uuidv4(), renderKey: "TerminalNode" })}
      >
        {React.createElement(TerminalNode)}
      </Col>
    </Row>
  );
};

const CardBody: React.FC<{ onNodeDrop: IOnNodeDrop }> = (props) => {
  const { graphConfig, onMouseDown, modelService, commandService } =
    useGraphDnd(props);
  return (
    <>
      <CardList
        title="参数"
        dataSource={[
          {
            id: uuidv4(),
            label: "算法组件1",
            renderKey: "ConnectorNode",
            width: 55,
            height: 55,
          },
        ]}
        onMouseDown={onMouseDown}
      />
      <CardList
        title="事实"
        dataSource={[
          {
            id: uuidv4(),
            label: "事实组件2",
            renderKey: "TerminalNode",
            width: 100,
            height: 35,
          },
        ]}
        onMouseDown={onMouseDown}
      />
      <Card title="条件类型" size="small">
        <BaseNode onMouseDown={onMouseDown} />
      </Card>
      <Card title="自定义" size="small">
        <div
          onMouseDown={onMouseDown({
            id: uuidv4(),
            renderKey: "ConnectorNode",
            width: 100,
            height: 40,
          })}
        >
          {React.createElement(ConnectorNode, {
            size: {
              width: 100,
              height: 40,
            },
            data: {},
            position: {
              x: 0,
              y: 0,
            },
          })}
        </div>
      </Card>
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
        title="123"
        size="small"
        style={{ height: "100%" }}
        bodyStyle={{
          padding: 0,
        }}
      >
        <CardBody onNodeDrop={onNodeDrop} />
      </Card>
    </WorkspacePanel>
  );
};

export default CustomPanel;
