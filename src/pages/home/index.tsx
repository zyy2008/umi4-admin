import { UserOutlined } from "@ant-design/icons";
import { KeepAliveContext, useLocation, useParams } from "@umijs/max";
import { Button } from "antd";
import React, { useState } from "react";

export default () => {
  const [count, setCount] = useState(0);
  const location = useLocation();
  const { updateTab } = React.useContext(KeepAliveContext);
  const params = useParams();

  React.useEffect(() => {
    updateTab(location.pathname, {
      closable: false,
    });
  }, []);

  return (
    <div>
      <h3>当前页面状态被设置成自动保存</h3>
      <h3>当前计数是：{count}</h3>
      <Button
        color="primary"
        block
        size="large"
        onClick={() => setCount(count + 1)}
      >
        点我计数加1
      </Button>
      {/* <Button onClick={handleClick}>修改tab</Button> */}
    </div>
  );
};
