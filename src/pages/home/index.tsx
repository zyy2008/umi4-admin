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

  return <div></div>;
};
