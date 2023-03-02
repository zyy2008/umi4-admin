import React from "react";
import ButtonModal from "@/components/button-modal";
import { SwapOutlined } from "@ant-design/icons";
import { Space, Select, Tree, TreeProps, Empty, Spin, message } from "antd";
import { useRequest } from "@umijs/max";
import { APIS } from "@/services";
import { ProCard, ProTable, ActionType } from "@ant-design/pro-components";
import { fileTypeName } from "./file";

type ObjectProps = {
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  value: string | null;
};

const Object: React.FC<ObjectProps> = (props) => {
  const { setValue, value } = props;
  const { data, loading } = useRequest(() =>
    APIS.DefaultApi.baseServerDataQueryQueryObjectGroupListGet()
  );

  return (
    <Space size={0}>
      <span>对象代号：</span>
      <Select
        style={{ width: 160 }}
        placeholder="请选择对象代号"
        loading={loading}
        options={data?.map(({ objectCode, objectName }) => ({
          label: objectName,
          value: objectCode,
        }))}
        value={value}
        onChange={setValue}
      />
    </Space>
  );
};

const TreeNode: React.FC<{ value: string | null }> = (props) => {
  const { value } = props;
  const { data, loading } = useRequest(
    () =>
      APIS.DefaultApi.kmsSysconfigServerDataQueryQueryObjectSatList({
        code: value,
      }),
    {
      refreshDeps: [value],
    }
  );

  const treeData = React.useMemo<TreeProps["treeData"]>(() => {
    if (data) {
      return data.map((item) => ({ key: item.satCode, title: item.satName }));
    }
    return [];
  }, [data]);

  const loadData = async () => {
    return [];
  };

  return (
    <Spin spinning={loading}>
      {treeData?.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Tree treeData={treeData} loadData={loadData} />
      )}
    </Spin>
  );
};

const SpanTag: React.FC<{ fileType: any }> = ({ fileType }) => {
  const name = fileTypeName?.[fileType];
  if (name) {
    return <span>{name}</span>;
  }
  return <span>未知类型</span>;
};

const DocConnect = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string | null>(null);
  const ref = React.useRef<ActionType>();
  const delHandle = async (fileName?: string) => {
    const { success } = await APIS.DefaultApi.kmsViewServerDocumentDeletePost({
      fileName,
    });
    if (success) {
      message.success("删除成功");
      ref.current?.reload();
    } else {
      message.warning("删除失败!");
    }
  };
  const downloadHandle = (fileName?: string) => {
    APIS.DefaultApi.kmsViewServerDocumentDownloadPost(
      {
        fileName,
      },
      {
        responseType: "blob",
        // prefix: "/atlas",
      }
    );
  };

  return (
    <ButtonModal
      buttonProps={{
        icon: <SwapOutlined />,
        type: "default",
        onClick: () => setOpen(true),
      }}
      tooltipProps={{
        title: "文件关联",
        placement: "top",
      }}
      modalProps={{
        open,
        width: 800,
        onCancel: () => setOpen(false),
        title: "文档关联",
        destroyOnClose: true,
        children: (
          <ProCard split="vertical" size="small">
            <ProCard
              title={<Object setValue={setValue} value={value} />}
              colSpan="260px"
              headerBordered
            >
              <TreeNode value={value} />
            </ProCard>
            <ProCard>
              <ProTable
                actionRef={ref}
                search={false}
                columns={[
                  {
                    title: "文件名称",
                    dataIndex: "objectName",
                  },
                  {
                    title: "文件类型",
                    dataIndex: "fileType",
                    hideInSearch: true,
                    render: (val) => <SpanTag fileType={val} />,
                  },
                  {
                    title: "操作",
                    key: "option",
                    width: 120,
                    valueType: "option",
                    render: (_, r) => [
                      <a
                        onClick={() => {
                          delHandle(r.objectName);
                        }}
                      >
                        删除
                      </a>,
                      <a
                        onClick={() => {
                          downloadHandle(r.objectName);
                        }}
                      >
                        下载
                      </a>,
                    ],
                  },
                ]}
                request={async () => {
                  const { success, data } =
                    await APIS.DefaultApi.kmsViewServerDocumentFindPost({
                      fileName: "",
                    });
                  return {
                    data,
                    success,
                  };
                }}
              />
            </ProCard>
          </ProCard>
        ),
      }}
    />
  );
};

export default DocConnect;
