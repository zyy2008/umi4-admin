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
    return APIS._Api.kmsZsbjServerApiCommonFunctionListGet({ name: "1" });
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
      const { success, errorMsg } = add
        ? await APIS._Api.kmsZsbjServerApiCommonFunctionAddPost(val)
        : await APIS._Api.kmsZsbjServerApiCommonFunctionUpdatePut(
            val as KnowledgeFunction
          );
      if (success && !errorMsg) {
        run();
        setOpen(false);
        return true;
      }
      return false;
    },
    [add]
  );
  return (
    <CardList
      title="公共函数"
      loading={loading}
      header={
        <BetaSchemaForm<KnowledgeFunDto>
          formRef={formRef}
          initialValues={{
            funContent: "函数内容1",
            funName: "函数1",
          }}
          title={add ? "新增函数" : "修改函数"}
          open={open}
          modalProps={{
            // destroyOnClose: true,
            maskClosable: false,
            onCancel: () => {
              setOpen(false);
              formRef.current?.resetFields();
            },
          }}
          trigger={
            <Button
              type="primary"
              onClick={() => {
                setAdd(true);
              }}
            >
              新增
            </Button>
          }
          layoutType="ModalForm"
          columns={[
            {
              title: "uuid",
              dataIndex: "uuid",
              valueType: "text",
              formItemProps: {
                style: {
                  display: "none",
                },
              },
            },
            {
              title: "函数名称",
              dataIndex: "funName",
              valueType: "text",
              formItemProps: {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
            {
              title: "函数内容",
              dataIndex: "funContent",
              valueType: "textarea",
              formItemProps: {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
          ]}
          onFinish={onFinish}
        />
      }
      dataSource={dataSource}
      onMouseDown={onMouseDown}
    />
  );
};

export default Public;
