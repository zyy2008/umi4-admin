import React from "react";
import { MODELS } from "@antv/xflow";
import { ViewHandle, CheckListProps } from "./components";

export const useView = () => {
  const rightRef = React.useRef<ViewHandle>(null);
  const onChange = React.useCallback<CheckListProps["onChange"]>(
    async (val, item) => {
      const app = rightRef.current?.app;
      console.log(val);
      if (app) {
        const x6Graph = await app.getGraphInstance();
        const node = await MODELS.SELECTED_NODE.useValue(app.modelService);
        const data = node.getData();
        const value = val ? item : { label: "", value: "" };
        node.setData({
          ...data,
          ...value,
        });
        x6Graph.cleanSelection();
        setTimeout(() => {
          x6Graph.select(node);
        }, 20);
      }
    },
    [rightRef]
  );
  return { rightRef, onChange };
};
