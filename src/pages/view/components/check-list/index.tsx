import React from "react";
import { CheckCard } from "@ant-design/pro-components";
import { Empty } from "antd";
import styles from "./index.less";

const list = [...Array(100).keys()];

type IProps = {
  disabled?: boolean;
};

const CheckList: React.FC<IProps> = (props) => {
  const { disabled } = props;
  return (
    <CheckCard.Group
      onChange={(value) => {
        console.log("value", value);
      }}
      size="small"
      className={styles["check-card"]}
      disabled={disabled}
    >
      {list.length > 0 ? (
        list.map((item) => <CheckCard title={item + 1} value={item + 1} />)
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
