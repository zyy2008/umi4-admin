import React from "react";
import { Button, Modal, message } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import Form, { ViewHandle } from "./form";
import { eventBind } from "@/pages/event-bind";

type IProps = {};

type FormData = {
  mids: string[];
  setting: {
    [key: string]: {
      events: string[];
      setting: {
        [key: string]: {
          num: string;
          time: string;
          topic: string;
          triggerType: number[];
          type: string;
        };
      }[];
    };
  }[];
};

const Bind: React.FC<IProps> = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const formRef = React.useRef<ViewHandle>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const onOk = () => {
    if (formRef.current) {
      const { form } = formRef.current;
      form?.submit().then(async (r) => {
        console.log(r);
        const { mids, setting } = r as any;
        setLoading(true);
        const params = mids.map((mid: string) => {
          const { events, setting: eventsSetting } = setting[mid];
          return {
            mid,
            events: events.map((id: string) => {
              const item = eventsSetting[id];
              return {
                id,
                tag: [],
              };
            }),
          };
        });
        const res = await eventBind(params);
        if (res === "success") {
          message.success("绑定成功");
        } else {
          message.warning("绑定失败");
        }
        setLoading(false);
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
        okButtonProps={{
          loading,
        }}
        destroyOnClose
        maskClosable={false}
        width={600}
      >
        <Form ref={formRef} />
      </Modal>
    </React.Fragment>
  );
};

export default Bind;
