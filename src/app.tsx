import {
  useKeepOutlets,
  RunTimeLayoutConfig,
  KeepAliveContext,
} from "@umijs/max";

export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    title: "123",
    layout: "mix",
    childrenRender: (_, props) => {
      const element = useKeepOutlets();
      return <>{element}</>;
    },
  };
};
