import { UserOutlined } from "@ant-design/icons";
import { KeepAliveContext, useLocation, useParams } from "@umijs/max";
import { Button } from "antd";
import React, { useState } from "react";
import data from "./chart.json";
import { formatJson } from "./chart";

export default () => {
  const [count, setCount] = useState(0);
  const location = useLocation();
  const { updateTab } = React.useContext(KeepAliveContext);
  const params = useParams();

  React.useEffect(() => {
    const str = formatJson(data as any);
    console.log(str);
    updateTab(location.pathname, {
      closable: false,
    });
  }, []);

  return <Button type="primary">111</Button>;
};
