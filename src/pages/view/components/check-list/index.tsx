import React from "react";
import {
  CheckCard as BaseCheckCard,
  CheckCardProps,
  CheckCardGroupProps,
} from "@ant-design/pro-components";
import { Empty } from "antd";
import { ViewHandle } from "../index";
import styles from "./index.less";
import { APIS, ParamBean } from "@/services";

export type CheckListProps = {
  disabled?: boolean;
  onChange: (value?: CheckCardProps["value"], item?: ParamBean) => void;
  nodesValue: CheckCardProps["value"];
  rightRef: React.RefObject<ViewHandle>;
  params?: ParamBean[];
};

const CheckCard: React.FC<CheckCardProps & { nodesValue: number[] }> = (
  props
) => {
  const { value, nodesValue, ...others } = props;
  const disabled = React.useMemo<boolean>(() => {
    const find = nodesValue?.filter((val) => val === value);
    return find?.length > 0;
  }, [nodesValue, value]);
  return <BaseCheckCard value={value} disabled={disabled} {...others} />;
};

const CheckList: React.FC<CheckListProps> = (props) => {
  const { disabled, onChange, nodesValue, rightRef, params = [] } = props;
  const [ycExist, seYcExist] = React.useState<ParamBean[]>([]);
  const [selectValue, setSelectValue] =
    React.useState<CheckCardGroupProps["value"]>();
  const value = React.useMemo<CheckCardGroupProps["value"]>(() => {
    if (disabled) {
      return nodesValue;
    }
    return selectValue;
  }, [disabled, selectValue, nodesValue]);

  const list = React.useMemo<ParamBean[]>(() => {
    return [...params, ...ycExist];
  }, [ycExist, params]);

  React.useEffect(() => {
    const app = rightRef.current?.app;
    if (app) {
      (async () => {
        const x6Graph = await app.getGraphInstance();
        x6Graph.on("node:selected", ({ node }) => {
          const data = node.getData();
          if (data?.value) {
            setSelectValue(data.value);
          } else {
            setSelectValue(undefined);
          }
        });
      })();
    }
  }, [rightRef.current]);

  React.useEffect(() => {
    (async () => {
      const { success, data } =
        await APIS.DefaultApi.baseServerDataQueryQueryTmBySidGet({
          satId: "10",
        });
      if (success) {
        const { success, data: val } = await APIS.DefaultApi.viewYcImportPost(
          {
            // parameters: ["参数1-4", "参数2-4", "参数100-111"],
            // satelliteCode: "xx_55",
            parameters: data?.map(({ tmName }) => tmName),
            satelliteCode: "YK-2",
          },
          { prefix: "/atlas" }
        );
        if (success) {
          const { ycExist = [] } = val ?? {};
          const find =
            data?.filter((item) => {
              const findIndex = ycExist?.findIndex(
                (tmCode) => tmCode === item.tmCode
              );
              return findIndex > -1;
            }) ?? [];
          seYcExist(find);
        }
      }
    })();
  }, []);

  const findItem = React.useCallback<
    (args: CheckCardProps["value"]) => ParamBean
  >(
    (val) => {
      const [item] = list.filter(({ tmCode }) => tmCode === val);
      return item;
    },
    [list]
  );
  return (
    <BaseCheckCard.Group
      multiple={disabled}
      size="small"
      className={styles["check-card"]}
      disabled={disabled}
      onChange={(val) => {
        setSelectValue(val);
        onChange(val, findItem(val));
      }}
      value={value}
    >
      {list.length > 0 ? (
        list.map((item) => (
          <CheckCard
            {...item}
            nodesValue={nodesValue}
            key={item.tmCode}
            title={item.tmName}
          />
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </BaseCheckCard.Group>
  );
};

export default React.memo(CheckList);
