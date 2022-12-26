import { NsGraph, uuidv4 } from "@antv/xflow";
import { ViewRelationship, KnowledgeView } from "@/services";
import type { DataNode } from "antd/es/tree";
import { groupBy, uniqBy, mergeWith, find } from "lodash";

type IProps = {
  formatData: NsGraph.INodeConfig[];
  data: ViewRelationship[];
  selectValue: number[];
};

export const formatGraphData: (T: IProps) => NsGraph.IGraphData = ({
  formatData,
  selectValue,
  data,
}) => {
  const nodes = formatData.filter(({ mark }) => {
    const find = selectValue.findIndex((val) => val === mark);
    return find > -1;
  });
  const edges = () => {
    const find = data.filter(({ parent, child }) => {
      const parentIndex = nodes.findIndex(({ id }) => id === `${parent?.id}`);
      const childIndex = nodes.findIndex(({ id }) => id === `${child?.id}`);
      return parentIndex > -1 && childIndex > -1;
    });
    return find.map((item) => {
      const [parent] = nodes.filter((list) => {
        return list.id === `${item.parent?.id}`;
      });
      const [child] = nodes.filter((list) => {
        return list.id === `${item.child?.id}`;
      });
      const sourcePortId = () => {
        const [port] = (parent?.ports as NsGraph.INodeAnchor[]).filter(
          (item) => {
            return item.type === "output";
          }
        );
        return port?.id;
      };
      const targetPortId = () => {
        const [port] = (child?.ports as NsGraph.INodeAnchor[]).filter(
          (item) => {
            return item.type === "input";
          }
        );
        return port?.id;
      };
      return {
        id: uuidv4(),
        source: `${item.parent?.id}`,
        target: `${item.child?.id}`,
        sourcePortId: sourcePortId(),
        targetPortId: targetPortId(),
      };
    });
  };

  return {
    nodes,
    edges: edges(),
  };
};

export const formatTree: (T: { data: ViewRelationship[] }) => DataNode[] = ({
  data,
}) => {
  const first = groupBy(data, "parent.id");
  const tree: DataNode[] = Object.keys(first).map((key) => {
    const item = first[key];
    const [val] = item;
    if (item.length === 1) {
      return {
        title: val.parent?.name,
        key: `${val.parent?.id}`,
        children: [
          {
            title: val.child?.name,
            key: `${val.child?.id}`,
            children: [],
          },
        ],
      };
    }
    return {
      title: val.parent?.name,
      key: `${val.parent?.id}`,
      children: item.map((item) => ({
        title: item?.child?.name,
        key: `${item?.child?.id}`,
        children: [],
      })),
    };
  });
  return tree;
};

export const treeDeep: (T: {
  key: string;
  formatTreeData: DataNode[];
}) => DataNode[] = ({ key, formatTreeData }) => {
  const find = formatTreeData.filter((item) => item.key === key);
  return find.map((item) => {
    return {
      ...item,
      children: item.children?.map((lts) => {
        const res = treeDeep({
          key: lts.key as string,
          formatTreeData,
        });
        if (res.length > 0) {
          const [val] = res;
          return val;
        }
        return lts;
      }),
    };
  });
};
