import type { IProps } from "./index";
import type { NsGraph, NsNodeCmd } from "@antv/xflow";
import type { Graph } from "@antv/x6";
import { XFlowNodeCommands } from "@antv/xflow";
import { createHookConfig, DisposableCollection } from "@antv/xflow";
import { DND_RENDER_ID } from "./constants";
import { DecisionNode } from "./nodes";
import { AlgoNode } from "./algo-node";

export const useGraphHookConfig = createHookConfig<IProps>((config, proxy) => {
  // 获取 Props
  const props = proxy.getValue();
  console.log("get main props", props);
  config.setRegisterHook((hooks) => {
    const disposableList = [
      // 注册增加 react Node Render
      hooks.reactNodeRender.registerHook({
        name: "add react node",
        handler: async (renderMap) => {
          renderMap.set(DND_RENDER_ID, DecisionNode);
        },
      }),
    ];
    const toDispose = new DisposableCollection();
    toDispose.pushAll(disposableList);
    return toDispose;
  });
});
