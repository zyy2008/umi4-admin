import { Graph } from "@antv/g6";

type MockType = {
  id: string;
  result: boolean;
  child?: MockType[];
};

export default class DataState {
  private data: MockType[];
  private graph: Graph;
  private timer: NodeJS.Timeout | null = null;
  private isRun: boolean = true;
  constructor(data: MockType[], graph: Graph) {
    this.data = data;
    this.graph = graph;
  }
  set setData(data: MockType[]) {
    this.data = data;
  }
  get getDate() {
    return this.data;
  }
  run(data: MockType[] = this.data, graph: Graph = this.graph) {
    data.forEach(({ id, result, child }) => {
      const item = graph.findById(id);
      if (item) {
        if (result) {
          graph.setItemState(item, "normal", true);
        } else {
          graph.setItemState(item, "warning", true);
        }
        if (child) {
          this.run(child, graph);
        }
        this.cycle();
      } else {
        this.cycle();
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
