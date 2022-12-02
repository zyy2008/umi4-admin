import React from "react";
import { WorkspacePanel, IWorkspacePanelProps, uuidv4 } from "@antv/xflow";
import { NsGraph, IGraphConfig } from "@antv/xflow-core";
import { Card, Input, List, Row, Col, Empty, Button } from "antd";
import VirtualList from "rc-virtual-list";
import { useGraphDnd, IPanelNode, IOnNodeDrop } from "@/components/flow";
import {
  DecisionNode,
  DataIONode,
  SectorNode,
  PreparationNode,
  ManualOperationNode,
} from "@/components/nodes";
import { BetaSchemaForm } from "@ant-design/pro-components";
import "./index.less";

const { Search } = Input;

type CardListProps = {
  title?: string;
  dataSource: IPanelNode[];
  loading?: boolean;
  onMouseDown: (
    nodeConfig: NsGraph.INodeConfig
  ) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  header?: React.ReactNode;
};

interface IConfigRenderOptions {
  graphConfig?: IGraphConfig;
  onMouseDown: (
    nodeConfig: NsGraph.INodeConfig
  ) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const CardList: React.FC<CardListProps> = (props) => {
  const { dataSource, title, onMouseDown, loading, header } = props;
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
        <div className="node-title">
          <span>{title}</span>
          <Search
            onSearch={setKeyword}
            allowClear
            placeholder="过滤条件"
            size="middle"
          />
          {header}
        </div>
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
            <List.Item
              onMouseDown={onMouseDown({
                ...item,
                fontSize: 15,
              })}
              className="node-list"
            >
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
  IConfigRenderOptions & {
    node: NsGraph.INodeRender;
    nodeConfig: Omit<NsGraph.INodeConfig, "id">;
    size?: NsGraph.IReactNodeProps["size"];
  }
> = ({ onMouseDown, node, nodeConfig, size }) => {
  const { label } = nodeConfig;
  return (
    <Col
      className="col-node"
      span={12}
      onMouseDown={onMouseDown({
        width: 110,
        height: 55,
        ...nodeConfig,
        id: uuidv4(),
        fontSize: 15,
      })}
    >
      {React.createElement(node, {
        size: {
          width: 110,
          height: 50,
          ...size,
        },
        data: { label, fontSize: 16 },
        position: {
          x: 0,
          y: 0,
        },
      })}
    </Col>
  );
};

const BaseNodes: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  return (
    <Row>
      <ColNode
        onMouseDown={onMouseDown}
        node={DecisionNode}
        nodeConfig={{
          label: "if",
          renderKey: "DecisionNode",
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
        }}
      />
      <ColNode
        onMouseDown={onMouseDown}
        node={DataIONode}
        nodeConfig={{
          label: "for",
          renderKey: "DataIONode",
        }}
      />
      <ColNode
        onMouseDown={onMouseDown}
        node={SectorNode}
        size={{
          width: 110,
          height: 55,
        }}
        nodeConfig={{
          label: "switch",
          renderKey: "SectorNode",
        }}
      />
      <ColNode
        onMouseDown={onMouseDown}
        node={ManualOperationNode}
        size={{
          width: 100,
          height: 50,
        }}
        nodeConfig={{
          label: "while",
          renderKey: "ManualOperationNode",
        }}
      />
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
            width: 70,
            height: 70,
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
            renderKey: "RectNode",
            width: 110,
            height: 50,
          },
        ]}
        onMouseDown={onMouseDown}
      />
      <Card title="条件类型" size="small">
        <BaseNodes onMouseDown={onMouseDown} />
      </Card>
      <Card title="自定义" size="small">
        <Row>
          <ColNode
            onMouseDown={onMouseDown}
            nodeConfig={{
              renderKey: "PreparationNode",
              label: "中间事件",
            }}
            node={PreparationNode}
          />
        </Row>
      </Card>
      <CardList
        title="公共函数"
        header={
          <BetaSchemaForm
            modalProps={{ destroyOnClose: true }}
            trigger={<Button type="primary">新增</Button>}
            layoutType="ModalForm"
            columns={[
              {
                title: "函数名称",
                dataIndex: "groupState",
                valueType: "text",
                formItemProps: {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                },
              },
              {
                title: "函数内容",
                dataIndex: "groupState1",
                valueType: "textarea",
                formItemProps: {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                },
              },
            ]}
          />
        }
        dataSource={[
          {
            id: uuidv4(),
            label: "函数组件1",
            renderKey: "MultiDocumentNode",
            width: 90,
            height: 60,
          },
        ]}
        onMouseDown={onMouseDown}
      />
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
