import { NsGraph, uuidv4 } from "@antv/xflow";
import { ViewRelationship } from "@/services";

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
