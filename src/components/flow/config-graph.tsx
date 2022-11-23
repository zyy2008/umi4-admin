import type { IProps } from "./index";
import { createHookConfig, DisposableCollection } from "@antv/xflow";
import type { Graph } from "@antv/x6";
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
              },
            };
            options.connecting = {
              ...options.connecting,
              ...graphOptions.connecting,
            };
            options.grid = true;
          },
        }),
      ];
      const toDispose = new DisposableCollection();
      toDispose.pushAll(disposableList);
      return toDispose;
    });
  }
);
