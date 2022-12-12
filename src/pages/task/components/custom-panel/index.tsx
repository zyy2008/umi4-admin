import React from "react";
import {
  WorkspacePanel,
  IWorkspacePanelProps,
  uuidv4,
  useXFlowApp,
} from "@antv/xflow";
import type { Cell } from "@antv/x6";
import { NsGraph, IGraphConfig } from "@antv/xflow-core";
import { Card, Input, List, Row, Col, Empty } from "antd";
import VirtualList from "rc-virtual-list";
import { useGraphDnd, IPanelNode, IOnNodeDrop } from "@/components/flow";
import { DecisionNode } from "@/components/nodes";

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
  const app = useXFlowApp();
  const [nodes, setNodes] = React.useState<NsGraph.INodeConfig[]>([]);
  const [keyword, setKeyword] = React.useState<string>("");
  const filterData = React.useMemo<IPanelNode[]>(() => {
    const list = dataSource.filter((node) => node.label?.includes(keyword));
    if (nodes.length > 0) {
      return list.map((item) => ({
        ...item,
        isDisabled: nodes.findIndex(({ itemId }) => itemId === item.id) > -1,
      }));
    }
    return list;
  }, [dataSource, keyword, nodes]);
  React.useEffect(() => {
    (async () => {
      if (app) {
        const graph = await app.getGraphInstance();
        graph.on("node:added", () => {
          const nodes = graph.getNodes();
          setNodes(nodes.map((cell) => cell.getData()));
        });
        graph.on("node:removed", () => {
          const nodes = graph.getNodes();
          setNodes(nodes.map((cell) => cell.getData()));
        });
      }
    })();
  }, [app]);
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
          height={400}
          itemHeight={36}
          itemKey="id"
        >
          {(item) => (
            <List.Item
              onMouseDown={onMouseDown({
                ...item,
                fontSize: 15,
                itemId: item.id,
              })}
              className={`node-list ${item.isDisabled ? "disabled" : ""}`}
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
            label: "任务1",
            renderKey: "ProcessNode",
            width: 110,
            height: 40,
          },
          {
            id: uuidv4(),
            label: "任务2",
            renderKey: "ProcessNode",
            width: 110,
            height: 40,
          },
        ]}
        onMouseDown={onMouseDown}
      />
      <Card title="条件类型" size="small">
        <BaseNodes onMouseDown={onMouseDown} />
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
        title="任务区"
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
