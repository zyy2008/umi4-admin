import { useKeepOutlets, RunTimeLayoutConfig } from "@umijs/max";
import { APIS } from "@/services";

export declare type AppInitialState = {
  satList: {
    pkId?: number;
    title: string;
    label: React.ReactNode;
    value: any;
  }[];
};

export const layout: RunTimeLayoutConfig = () => {
  return {
    title: "XX系统",
    layout: "side",
    childrenRender: (_, props) => {
      const element = useKeepOutlets();
      return <>{element}</>;
    },
  };
};

export async function getInitialState(): Promise<AppInitialState> {
  // const { data = [] } =
  //   await APIS.DefaultApi.baseServerDataQueryQuerySatListGet();
  const data: any[] = [];
  return {
    satList: data.map(({ satCode, satName, pkId }) => ({
      pkId,
      label: satName,
      value: satCode,
      title: satName,
    })),
  };
}
