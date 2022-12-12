import React from "react";
import type { Graph } from "@antv/x6";
import { useXFlowApp, getNodeReactComponent } from "@antv/xflow-core";
import type { IGraphConfig, NsGraph } from "@antv/xflow-core";
import type {
  INodeCollapsePanelProps,
  IModelService,
  IGraphCommandService,
} from "@antv/xflow";
import { Addon } from "@antv/x6";
import { XFlowNode } from "@/components/flow/node";

export interface IBodyProps
  extends Omit<INodeCollapsePanelProps, "position" | "nodeDataService"> {}

export interface IConfigRenderOptions {
  graphConfig?: IGraphConfig;
  onMouseDown: (
    nodeConfig: NsGraph.INodeConfig
  ) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  modelService?: IModelService;
  commandService?: IGraphCommandService;
}

export interface IPanelNode extends NsGraph.INodeConfig {
  /**  Dnd节点的popover的提示内容，可选  */
  popoverContent?: React.ReactNode;
  /**  自定义节点  */
  renderComponent?: React.ComponentType<{
    data: IPanelNode;
    isNodePanel: boolean;
  }>;
  /** 自定义数据 */
  data?: any;
  /** disable */
  isDisabled?: boolean;
}

export const defaultNodeFactory = (args: any) => {
  return new XFlowNode(args);
};

export const useGraphDnd = (props: IBodyProps): IConfigRenderOptions => {
  const { onNodeDrop, dndOptions, x6NodeFactory } = props;
  const { graphProvider, modelService, commandService } = useXFlowApp();
  const [graphConfig, setConfig] = React.useState<IGraphConfig>();
  const [dnd, setDnd] = React.useState<Addon.Dnd>();
  const [graph, setGraph] = React.useState<Graph>();

  /** 引用 graph 配置 */
  React.useEffect(() => {
    graphProvider.getGraphInstance().then((x6Graph: Graph) => {
      setGraph(x6Graph);
    });
    graphProvider.getGraphOptions().then((x6GraphConfig: IGraphConfig) => {
      setConfig(x6GraphConfig);
    });
  }, [graphProvider, setGraph, setConfig]);

  /** 初始化 Dnd 实例 */
  React.useEffect(() => {
    if (!graph) {
      return;
    }
    const dndInstance = new Addon.Dnd({
      scaled: false,
      animation: false,
      ...dndOptions,
      target: graph,
      /** 这里考虑到需要新增群组的需求，不使用x6的getDropNod方法
       * 在validateNode时调用command添加
       */
      validateNode: async (droppingNode) => {
        const nodeConfig = {
          ...droppingNode.getData<IPanelNode>(),
          ...droppingNode.getPosition(),
        };
        if (onNodeDrop) {
          await onNodeDrop(nodeConfig, commandService, modelService);
        } else {
          console.error("onNodeDrop method is required in NodeTree Panel");
        }
        return false;
      },
    });
    setDnd(dndInstance);

    return () => {
      dndInstance.dispose();
    };
  }, [commandService, modelService, dndOptions, graph, onNodeDrop]);

  /** 开始拖拽 */
  const onMouseDown = React.useCallback(
    (nodeConfig: IPanelNode) =>
      (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (!graph || !dnd || !graphConfig) {
          return;
        }
        if (nodeConfig.isDisabled) {
          return;
        }
        // 获取节点组件
        const renderKey = graphConfig.nodeTypeParser(nodeConfig);
        const reactComponent = nodeConfig.renderComponent
          ? nodeConfig.renderComponent
          : graphConfig.nodeRender.get(renderKey);
        // 包裹节点组件
        const wrappedComponent = getNodeReactComponent(
          reactComponent as React.ComponentType<any>,
          commandService,
          modelService
        );
        const nodeData = {
          data: nodeConfig,
          width: nodeConfig.width || 180,
          height: nodeConfig.height || 40,
          view: graphConfig.graphId,
          component: wrappedComponent,
        };
        const x6Node = x6NodeFactory
          ? x6NodeFactory(nodeData)
          : defaultNodeFactory(nodeData);
        dnd.start(x6Node, e.nativeEvent as any);
      },
    [commandService, dnd, graph, graphConfig, modelService, x6NodeFactory]
  );

  return { graphConfig, onMouseDown, modelService, commandService };
};
