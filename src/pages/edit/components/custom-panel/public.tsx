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
      title="公共函数"
      loading={loading}
      header={
        <BetaSchemaForm<KnowledgeFunDto>
          formRef={formRef}
          title={add ? "新增函数" : "修改函数"}
          open={open}
          modalProps={{
            // destroyOnClose: true,
            maskClosable: false,
            onCancel: () => {
              setOpen(false);
              formRef.current?.resetFields();
            },
            bodyStyle: {
              maxHeight: 600,
              overflowY: "auto",
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
              title: "函数参数",
              dataIndex: "paramNote",
              valueType: "formList",
              columns: [
                {
                  valueType: "group",
                  columns: [
                    {
                      dataIndex: "name",
                      title: "参数名称",
                      formItemProps: {
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      },
                    },
                    {
                      dataIndex: "paramNote",
                      title: "参数说明",
                    },
                  ],
                },
              ],
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
            {
              title: "返回类型",
              dataIndex: "returnType",
              valueType: "select",
              fieldProps: {
                options: [
                  {
                    label: "int",
                    value: 1,
                  },
                  {
                    label: "float",
                    value: 2,
                  },
                  {
                    label: "string",
                    value: 3,
                  },
                  {
                    label: "boolean",
                    value: 4,
                  },
                  {
                    label: "void",
                    value: 5,
                  },
                ],
              },
              formItemProps: {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
            {
              title: "返回说明",
              dataIndex: "returnNote",
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
