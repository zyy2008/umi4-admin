import React from "react";
import { Transfer, Form } from "antd";
import ButtonModal from "@/components/button-modal";
import { APIS, ParamBean } from "@/services";
import {} from "lodash";

type IProps = {
  onOk?: (T: ParamBean[]) => void;
};

const ParamsExport: React.FC<IProps> = (props) => {
  const { onOk: ok } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [dataSource, setDataSource] = React.useState<ParamBean[]>([]);
  const [form] = Form.useForm<{ params: string[] }>();
  React.useEffect(() => {
    APIS.DefaultApi.baseServerDataQueryQueryTmBySidGet({
      satId: "10",
    }).then(({ success, data = [] }) => {
      if (success) {
        setDataSource(data);
      }
    });
  }, []);
  const onOk = () => {
    form.validateFields().then(({ params }) => {
      const find = dataSource?.filter((item) => {
        const findIndex = params.findIndex((tmCode) => tmCode === item.tmCode);
        return findIndex > -1;
      });
      setOpen(false);
      ok?.(find);
    });
  };

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
        children: (
          <Form<{ params: string[] }> form={form}>
            <Form.Item
              name="params"
              rules={[{ required: true, message: "请选择导入参数" }]}
              valuePropName="targetKeys"
            >
              <Transfer<ParamBean>
                dataSource={dataSource}
                rowKey={(record) => record.tmCode}
                pagination
                showSearch
                render={(record) => record.tmName}
                style={{
                  height: 400,
                }}
              />
            </Form.Item>
          </Form>
        ),
        width: 600,
        onCancel: () => {
          setOpen(false);
        },
        open,
        onOk,
      }}
    />
  );
};

export default React.memo(ParamsExport);
