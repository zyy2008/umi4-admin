import type { IProps } from "./index";
import { createHookConfig, DisposableCollection, NsGraph } from "@antv/xflow";
import type { Graph, CellView, Cell, Node } from "@antv/x6";
import * as NodesComponent from "../nodes";

export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}

export const useGraphHookConfig = createHookConfig<IProps>(
  async (config, proxy) => {
    // 获取 Props
    const { nodeMovable = true, graphOptions: customOptions } =
      proxy.getValue();
    config.setRegisterHook((hooks) => {
      const disposableList = [
        // 注册增加 react Node Render
        hooks.reactNodeRender.registerHook({
          name: "add react node",
          handler: async (renderMap) => {
            Object.keys(NodesComponent).forEach((key) => {
              if (isValidKey(key, NodesComponent)) {
                renderMap.set(key, NodesComponent[key]);
              }
            });
          },
        }),
        // 注册修改graphOptions配置的钩子
        hooks.graphOptions.registerHook({
          name: "custom-x6-options",
          after: "dag-extension-x6-options",
          handler: async (options) => {
            const graphOptions: Graph.Options = {
              connecting: {
                // 是否触发交互事件
                validateMagnet() {
                  return true;
                },
                // 显示可用的链接桩
                validateConnection(args) {
                  const { sourceView, targetView, sourceMagnet, targetMagnet } =
                    args;
                  // 不允许连接到自己
                  if (sourceView === targetView) {
                    return false;
                  }

                  if (!sourceMagnet || !targetMagnet) {
                    return false;
                  }

                  // 判断源链接桩是否可连接
                  const sourceNode = sourceView!.cell as Node;
                  const sourcePortId = sourceMagnet.getAttribute("port");
                  if (!sourcePortId) {
                    return false;
                  }

                  const sourcePort = sourceNode.getPort(sourcePortId);
                  if (sourcePort?.type !== NsGraph.AnchorType.OUTPUT) {
                    return false;
                  }

                  // 判断目标链接桩是否可连接
                  const targetNode = targetView!.cell as Node;
                  const targetPortId = targetMagnet.getAttribute("port")!;
                  if (!targetPortId) {
                    return false;
                  }

                  const targetPort = targetNode.getPort(targetPortId);
                  if (targetPort?.type !== NsGraph.AnchorType.INPUT) {
                    return false;
                  }

                  const targetData: NsGraph.INodeConfig = targetNode.getData();
                  const sourceData: NsGraph.INodeConfig = sourceNode.getData();

                  if (sourceData.group) {
                    return targetData.group === sourceData.group;
                  }
                  return !(targetPort && targetPort.connected);
                },
                snap: {
                  radius: 50,
                },
              },
            };
            options.connecting = {
              ...options.connecting,
              ...graphOptions.connecting,
            };
            options.grid = true;
            options.embedding = {
              enabled: true,
              findParent({ node }) {
                const bbox = node.getBBox();
                return this.getNodes().filter((node) => {
                  const data = node.getData<any>();
                  if (data && data.parent) {
                    const targetBBox = node.getBBox();
                    return bbox.isIntersectWithRect(targetBBox);
                  }
                  return false;
                });
              },
            };
            options.interacting = {
              nodeMovable,
              edgeLabelMovable: false,
            };
            const custom = customOptions?.(options) ?? {};
            Object.assign(options, custom);
          },
        }),
      ];
      const toDispose = new DisposableCollection();
      toDispose.pushAll(disposableList);
      return toDispose;
    });
  }
);
