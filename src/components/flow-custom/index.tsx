import React from "react";
import { Input, List, Col, Empty, Button } from "antd";
import { IPanelNode, IConfigRenderOptions } from "../flow";
import VirtualList from "rc-virtual-list";
import { EditOutlined } from "@ant-design/icons";
import { NsGraph } from "@antv/xflow-core";
import { uuidv4, useXFlowApp } from "@antv/xflow";
import type { Graph } from "@antv/x6";

const { Search } = Input;

export type CardListProps = {
  title?: string;
  dataSource: IPanelNode[];
  loading?: boolean;
  onMouseDown: IConfigRenderOptions["onMouseDown"];
  header?: React.ReactNode;
  filterData?: IPanelNode[];
  setKeyword?: React.Dispatch<React.SetStateAction<string>>;
  height?: number;
};

export const CardList: React.FC<CardListProps> = (props) => {
  const {
    dataSource,
    title,
    onMouseDown,
    loading,
    header,
    filterData,
    height = 200,
  } = props;
  const [keyword, setKeyword] = React.useState<string>("");
  const data = React.useMemo<IPanelNode[]>(() => {
    if (filterData && filterData.length > 0) {
      return filterData;
    }
    const list = dataSource?.filter((node) => node.label?.includes(keyword));
    return list;
  }, [dataSource, keyword, filterData]);
  return (
    <List
      loading={loading}
      dataSource={[]}
      split={false}
      header={
        <div className="node-title">
          <span>{title}</span>
          <Search
            onSearch={props?.setKeyword ? props?.setKeyword : setKeyword}
            allowClear
            placeholder="过滤条件"
            size="middle"
          />
          {header}
        </div>
      }
    >
      {data?.length > 0 ? (
        <VirtualList data={data} height={height} itemHeight={36} itemKey="id">
          {(item) => (
            <List.Item className="node-item">
              <div
                className={`node-list ${item.isDisabled ? "disabled" : ""}`}
                onMouseDown={onMouseDown({
                  ...item,
                  fontSize: 15,
                  itemId: item.id,
                })}
              >
                {item.label}
                {item?.onEditClick && (
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={item?.onEditClick}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                )}
              </div>
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

export const ColNode: React.FC<
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

export const CardListDisabled: React.FC<CardListProps> = (props) => {
  const { dataSource } = props;
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
        const graph: Graph = await app.getGraphInstance();
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
    <CardList {...props} setKeyword={setKeyword} filterData={filterData} />
  );
};
