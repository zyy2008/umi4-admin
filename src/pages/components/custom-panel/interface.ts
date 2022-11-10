import type {
  IModelService,
  IGraphCommandService,
  NsGraph,
} from "@antv/xflow-core";

export interface IOnNodeDrop {
  (
    /** 节点元数据 */
    nodeMeta: IPanelNode,
    /** commandService */
    commandService: IGraphCommandService,
    /** modelService */
    modelService: IModelService
  ): Promise<void>;
}

export interface IPanelNode extends NsGraph.INodeConfig {
  /** disable */
  isDisabled?: boolean;
}
