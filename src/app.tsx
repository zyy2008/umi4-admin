import { useKeepOutlets, RunTimeLayoutConfig } from "@umijs/max";
import { APIS } from "@/services";
import { SelectProps } from "antd";

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

export async function getInitialState(): Promise<{
  satList?: SelectProps["options"] & { pkId?: number };
}> {
  const { data = [] } =
    await APIS.DefaultApi.baseServerDataQueryQuerySatListGet();
  return {
    satList: data.map(({ satCode, satName, pkId }) => ({
      pkId,
      label: satName,
      value: satCode,
    })),
  };
}
