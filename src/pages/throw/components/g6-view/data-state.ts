import { Graph } from "@antv/g6";
import { NsGraph } from "@antv/xflow";

type ResultType = {
  id: string;
  result: boolean;
  child?: ResultType[];
};

type Data = {
  graphData: NsGraph.IGraphData;
  targetData: ResultType[];
};

export default class DataState {
  private data: Data = {
    graphData: { nodes: [], edges: [] },
    targetData: [],
  };
  private graph: Graph;
  private timer: NodeJS.Timeout | null = null;
  private isRun: boolean = true;
  constructor(graph: Graph, data?: Data) {
    this.data = {
      ...this.data,
      ...data,
    };
    this.graph = graph;
  }
  set setData(data: Data) {
    this.data = {
      ...this.data,
      ...data,
    };
  }
  get getDate() {
    return this.data;
  }
  run(data: Data = this.data, graph: Graph = this.graph) {
    const { targetData, graphData } = data;
    targetData?.forEach(({ id, result, child }) => {
      const item = graph.findById(id);
      if (item) {
        if (result) {
          item.setState("normal", true);
        } else {
          item.setState("warning", true);
        }
      }
      if (child) {
        const { edges } = graphData;
        if (!result && edges.length > 0) {
          this.findParentId(id, edges);
        }
        this.run({
          targetData: child,
          graphData,
        });
      }
      this.cycle();
    });
  }
  findParentId(id: string, edges: NsGraph.IEdgeConfig[]) {
    const handle = (id: string): string[] => {
      const find = edges.filter(({ target }) => target === id);
      if (find.length > 0) {
        const [{ source }] = find;
        return [source, ...handle(source)];
      }
      return [];
    };
    const res = handle(id);
    res.forEach((id) => {
      const item = this.graph.findById(id);
      if (item) {
        item.setState("warning", true);
      }
    });
  }
  cycle() {
    if (this.isRun) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.run();
      }, 2000);
    }
  }
  stop() {
    this.isRun = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
