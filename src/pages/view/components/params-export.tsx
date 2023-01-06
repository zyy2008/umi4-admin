import React from "react";
import ButtonModal from "@/components/button-modal";
import { Transfer } from "./transfer";
import { APIS } from "@/services";

const ParamsExport = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  React.useEffect(() => {
    APIS.DefaultApi.baseServerDataQueryQueryTmBySidGet({
      satId: "10",
    }).then((res) => {
      console.log(res);
    });
  }, []);
  return (
    <ButtonModal
      buttonProps={{
        children: "导入",
        onClick: () => {
          setOpen(true);
        },
      }}
      modalProps={{
        title: "参数导入",
        children: <Transfer />,
        width: 600,
        onCancel: () => {
          setOpen(false);
        },
        open,
      }}
    />
  );
};

export default ParamsExport;
