import React from "react";
import type { IConfigRenderOptions } from "@/components/flow";
import { BetaSchemaForm, ProFormInstance } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRequest } from "@umijs/max";
import { APIS, KnowledgeFunDto, KnowledgeFunction } from "@/services";
import { CardList, CardListProps } from "@/components/flow-custom";

const Public: React.FC<IConfigRenderOptions> = (props) => {
  const { onMouseDown } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [add, setAdd] = React.useState<boolean>(false);
  const formRef = React.useRef<ProFormInstance>();
  const {
    data = [],
    loading,
    run,
  } = useRequest(() => {
    return APIS._Api.kmsZsbjServerApiCommonFunctionListGet({});
  });
  const dataSource = React.useMemo<CardListProps["dataSource"]>(() => {
    return data?.map((item) => ({
      ...item,
      label: item.funName,
      id: item.uuid,
      renderKey: "MultiDocumentNode",
      width: 90,
      height: 60,
      onEditClick: () => {
        formRef.current?.setFieldsValue(item);
        setOpen(true);
        setAdd(false);
      },
    }));
  }, [data]);
  const onFinish = React.useCallback<
    (T: KnowledgeFunDto | KnowledgeFunction) => Promise<any>
  >(
    async (val) => {
      const { success } = add
        ? await APIS._Api.kmsZsbjServerApiCommonFunctionAddPost(
            val as KnowledgeFunDto
          )
        : await APIS._Api.kmsZsbjServerApiCommonFunctionUpdatePut({
            uuid: "",
            ...val,
          } as KnowledgeFunction);
      if (success) {
        run();
        setOpen(false);
      }
      return success;
    },
    [add]
  );
  return (
    <CardList
      title="已定制事件"
      loading={loading}
      dataSource={dataSource}
      onMouseDown={onMouseDown}
    />
  );
};

export default Public;
