import { useState, useEffect, FC } from "react";
import { Transfer as BaseTransfer, TransferProps } from "antd";

export default function Transfer<T>(props: TransferProps<T>) {
  return (
    <BaseTransfer
      {...props}
      showSearch
      listStyle={{
        width: "50%",
        height: 400,
      }}
    />
  );
}
