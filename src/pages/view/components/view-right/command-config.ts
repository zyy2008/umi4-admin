import { IProps } from "@/components/flow";
export const commandConfig: IProps["commandConfig"] = (hooks) => {
  return [
    hooks.addEdge.registerHook({
      name: "get edge config from  api",
      handler: async (args) => {
        args.createEdgeService = async (args) => {
          const { edgeConfig } = args;
          console.log(args);
          return edgeConfig;
        };
      },
    }),
  ];
};
