import { createGraphConfig } from "@antv/xflow";

/**  graphConfig：配置Graph  */
export const useGraphConfig = createGraphConfig<any>((graphConfig) => {
  graphConfig.setDefaultNodeRender((props) => {
    return <div className="react-node"> {props.data.label} </div>;
  });
});
