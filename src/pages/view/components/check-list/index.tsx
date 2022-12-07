import React from "react";
import { CheckCard, CheckCardProps } from "@ant-design/pro-components";
import { Empty } from "antd";
import styles from "./index.less";

const list: Item[] = [...Array(100).keys()].map((item) => ({
  label: `label-${item}`,
  value: item + 1,
}));

type Item = {
  label: string;
  value: CheckCardProps["value"];
};

export type CheckListProps = {
  disabled?: boolean;
  onChange: (value?: CheckCardProps["value"], item?: Item) => void;
};

const CheckList: React.FC<CheckListProps> = (props) => {
  const { disabled, onChange } = props;
  return (
    <CheckCard.Group
      size="small"
      className={styles["check-card"]}
      disabled={disabled}
    >
      {list.length > 0 ? (
        list.map((item) => (
          <CheckCard
            title={item.label}
            value={item.value}
            key={item.value}
            onChange={(val) => onChange(val, item)}
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
    </CheckCard.Group>
  );
};

export default CheckList;
