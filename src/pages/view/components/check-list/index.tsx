import React from "react";
import {
  CheckCard as BaseCheckCard,
  CheckCardProps,
  CheckCardGroupProps,
} from "@ant-design/pro-components";
import { Empty } from "antd";
import { Graph } from "@antv/x6";
import styles from "./index.less";

const list: Item[] = [...Array(100).keys()].map((item) => ({
  label: `label-${item}`,
  value: item + 1,
}));

type Item = {
  label?: string;
  value?: CheckCardProps["value"];
};

export type CheckListProps = {
  disabled?: boolean;
  onChange: (value?: CheckCardProps["value"], item?: Item) => void;
  nodesValue: CheckCardProps["value"];
  x6Graph?: Graph;
};

const findItem: (args: CheckCardProps["value"]) => Item = (val) => {
  if (val) {
    const [item] = list.filter(({ value }) => value === val);
    return item;
  }
  return {};
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
  const { disabled, onChange, nodesValue, x6Graph } = props;
  const [selectValue, setSelectValue] =
    React.useState<CheckCardGroupProps["value"]>();
  const value = React.useMemo<CheckCardGroupProps["value"]>(() => {
    if (disabled) {
      return nodesValue;
    }
    return selectValue;
  }, [disabled, selectValue, nodesValue]);

  React.useEffect(() => {
    if (x6Graph) {
      x6Graph.on("node:selected", ({ node }) => {
        const data = node.getData();
        if (data?.value) {
          setSelectValue(data.value);
        } else {
          setSelectValue(undefined);
        }
      });
    }
  }, [x6Graph]);
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
            key={item.value}
            title={item.label}
          />
        ))
      ) : (
        <Empty
          style={{
            height: 200,
          }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </BaseCheckCard.Group>
  );
};

export default CheckList;
