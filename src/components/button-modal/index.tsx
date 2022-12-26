import React from "react";
import {
  Button,
  Modal,
  ButtonProps,
  ModalProps,
  Tooltip,
  TooltipProps,
} from "antd";

export type ButtonModalProps = {
  buttonProps?: ButtonProps;
  modalProps?: ModalProps;
  tooltipProps?: TooltipProps;
};

const ButtonModal: React.FC<ButtonModalProps> = (props) => {
  const { modalProps, buttonProps, tooltipProps } = props;

  const isOpenProps = React.useMemo<TooltipProps>(() => {
    if (tooltipProps) {
      return tooltipProps;
    }
    return {
      open: false,
    };
  }, [tooltipProps]);
  return (
    <>
      <Tooltip placement="bottom" {...isOpenProps}>
        <Button type="primary" {...buttonProps} />
      </Tooltip>
      <Modal {...modalProps} maskClosable={false} />
    </>
  );
};

export default ButtonModal;
