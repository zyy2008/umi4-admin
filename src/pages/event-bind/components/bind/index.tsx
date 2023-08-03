import React from "react";
import { Button, Modal } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import Form, { ViewHandle } from "./form";

type IProps = {};

const Bind: React.FC<IProps> = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const formRef = React.useRef<ViewHandle>(null);
  const onOk = () => {
    if (formRef.current) {
      const { form } = formRef.current;
      form?.submit().then((res) => {
        console.log(res);
      });
    }
  };
  return (
    <React.Fragment>
      <Button
        type="primary"
        icon={<SwapOutlined />}
        onClick={() => setOpen(true)}
      >
        绑定
      </Button>
      <Modal
        open={open}
        title="卫星事件绑定"
        onOk={onOk}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Form ref={formRef} />
      </Modal>
    </React.Fragment>
  );
};

export default Bind;
