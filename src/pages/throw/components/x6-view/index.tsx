import React from "react";
import data from "../../json";
import Graph from "./register";
import { Node } from "@antv/x6";
import { DagreLayout } from "@antv/layout";
import Drawer from "./drawer";
import { Portal } from "@antv/x6-react-shape";
import { NsGraph } from "@antv/xflow";

type TypeOpen = {
  value: boolean;
  data: { [key: string]: any };
};

export type ContextProps = {
  graph?: Graph;
  open?: TypeOpen;
  setOpen?: React.Dispatch<React.SetStateAction<TypeOpen>>;
};

const X6ReactPortalProvider = Portal.getProvider();

export const ViewContext = React.createContext<ContextProps>({
  graph: void 0,
  setOpen: void 0,
});

type IProps = {
  viewData: NsGraph.IGraphData;
};

const X6View: React.FC<IProps> = (props) => {
  const { viewData } = props;
  const divRef = React.useRef<HTMLDivElement>(null);
  const [graph, setGraph] = React.useState<Graph>();
  const [open, setOpen] = React.useState<TypeOpen>({
    value: false,
    data: {},
  });

  React.useEffect(() => {
    if (divRef.current) {
      // 初始化画布
      const graph = new Graph({
        container: divRef.current,
        panning: {
          enabled: true,
        },
        grid: true,
        connecting: {
          router: {
            name: "manhattan",
            args: {
              startDirections: ["bottom"],
              endDirections: ["top"],
              padding: 40,
            },
          },
          connectionPoint: "boundary",
        },
        selecting: false,
        interacting: false,
      });
      setGraph(graph);
    }
  }, [divRef.current]);
  React.useEffect(() => {
    if (graph && viewData) {
      const gridLayout = new DagreLayout({
        type: "dagre",
        rankdir: "TB",
        align: void 0,
        ranksep: 40,
        nodesep: 30,
        controlPoints: false,
      });
      const model = gridLayout.layout({
        ...viewData,
        edges: viewData.edges.map((item) => ({ ...item, shape: "org-edge" })),
        nodes: viewData.nodes.map(
          ({
            id,
            renderKey: shape,
            width,
            height,
            label,
            fontSize,
            ...others
          }) => ({
            id,
            shape,
            width,
            height,
            data: {
              collapse: true,
              shape,
              label,
              fontSize,
              size: {
                width,
                height,
              },
              ...others,
            },
          })
        ),
      });
      graph.fromJSON(model);
      graph.centerContent();
    }
  }, [graph, viewData]);
  return (
    <ViewContext.Provider value={{ graph, open, setOpen }}>
      <X6ReactPortalProvider />
      <div
        ref={divRef}
        style={{
          height: "100%",
        }}
      >
        <Drawer />
      </div>
    </ViewContext.Provider>
  );
};

export default React.memo(X6View);
