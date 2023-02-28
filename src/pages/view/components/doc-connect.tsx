import React from "react";
import ButtonModal from "@/components/button-modal";
import { SwapOutlined } from "@ant-design/icons";
import { Space, Select, Tree, TreeProps, Empty, Spin } from "antd";
import { useRequest } from "@umijs/max";
import { APIS } from "@/services";
import { ProCard, ProTable } from "@ant-design/pro-components";

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

const DocConnect = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string | null>(null);
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
        children: (
          <ProCard split="vertical" size="small">
            <ProCard
              title={<Object setValue={setValue} value={value} />}
              colSpan="260px"
            >
              <TreeNode value={value} />
            </ProCard>
            <ProCard>
              <ProTable
                request={async () => {
                  const { success, data } =
                    await APIS.DefaultApi.kmsViewServerDocumentFindPost({
                      fileType: "1",
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
