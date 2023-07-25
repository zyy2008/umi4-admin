import Json1 from "./data1.json";
import Json2 from "./data2.json";
import { NsGraph } from "@antv/xflow";

export type DataType = {
  meta: NsGraph.IGraphMeta;
  graphData: NsGraph.IGraphData;
};

const data: DataType[] = [Json1 as any, Json2 as any];

export default data;
