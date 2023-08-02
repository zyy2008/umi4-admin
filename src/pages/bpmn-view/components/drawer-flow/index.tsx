import React from "react";

import { Tag, Progress, Drawer } from "antd";

type IProps = {
  checkValue?: string;
  setCheckValue?: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const Page: React.FC<IProps> = ({ checkValue, setCheckValue }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  React.useEffect(() => {
    setOpen(!!checkValue);
  }, [checkValue]);
  return (
    <Drawer
      placement="bottom"
      open={open}
      onClose={() => {
        setOpen(false);
        setCheckValue?.(void 0);
      }}
    >
      123
    </Drawer>
  );
};

export default Page;
