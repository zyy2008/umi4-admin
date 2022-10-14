import React from "react";
import { WorkspacePanel, IWorkspacePanelProps, uuidv4 } from "@antv/xflow";
import { NsGraph, IGraphConfig } from "@antv/xflow-core";
import { Card, CardProps, Space, Input, List, Row, Col, Empty } from "antd";
import VirtualList from "rc-virtual-list";
import { useGraphDnd, IPanelNode } from "./dnd-hook";
import type { IOnNodeDrop } from "./interface";
import { DecisionNode, DataIONode, TerminalNode, EllipseNode } from "../nodes";
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

const ColNode: React.FC<
  IConfigRenderOptions & { label: string; node: NsGraph.INodeRender }
> = ({ onMouseDown, label, node }) => (
  <Col
    style={{
      padding: "20px 10px",
    }}
    span={12}
    onMouseDown={onMouseDown({
      id: uuidv4(),
      renderKey: "EllipseNode",
      width: 120,
      height: 40,
      label,
      fontSize: 16,
    })}
  >
    {React.createElement(node, {
      size: {
        width: 110,
        height: 40,
      },
      data: { label },
      position: {
        x: 0,
        y: 0,
      },
    })}
  </Col>
);

const BaseNode: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  return (
    <Row>
      <Col
        style={{
          padding: "20px 10px",
        }}
        span={12}
        onMouseDown={onMouseDown({
          id: uuidv4(),
          renderKey: "DecisionNode",
          label: "if",
          width: 120,
          height: 50,
          fontSize: 16,
          ports: [
            {
              type: NsGraph.AnchorType.OUTPUT,
              group: NsGraph.AnchorGroup.LEFT,
              tooltip: "输出桩",
            },
            {
              type: NsGraph.AnchorType.OUTPUT,
              group: NsGraph.AnchorGroup.RIGHT,
              tooltip: "输出桩",
            },
            {
              type: NsGraph.AnchorType.INPUT,
              group: NsGraph.AnchorGroup.TOP,
              tooltip: "输入桩",
            },
          ] as NsGraph.INodeAnchor[],
        })}
      >
        {React.createElement(DecisionNode, {
          data: { label: "if" },
          size: {
            width: 80,
            height: 30,
          },
          position: {
            x: 0,
            y: 0,
          },
        })}
      </Col>
      <Col
        style={{
          padding: "20px 10px",
        }}
        span={12}
        onMouseDown={onMouseDown({
          id: uuidv4(),
          renderKey: "DataIONode",
          label: "for",
          width: 120,
          height: 50,
          fontSize: 16,
        })}
      >
        {React.createElement(DataIONode, {
          data: { label: "for" },
          size: {
            width: 80,
            height: 30,
          },
          position: {
            x: 0,
            y: 0,
          },
        })}
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
  const { onMouseDown } = useGraphDnd(props);
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
            ports: [
              {
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.BOTTOM,
                tooltip: "输出桩",
              },
            ] as NsGraph.INodeAnchor[],
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
        <Row>
          <ColNode
            onMouseDown={onMouseDown}
            label="自定义"
            node={EllipseNode}
          />
        </Row>
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
