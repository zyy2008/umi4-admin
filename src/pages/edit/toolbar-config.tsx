import React from "react";
import type { IToolbarItemOptions, IToolbarGroupOptions } from "@antv/xflow";
import { createToolbarConfig } from "@antv/xflow";
import { XFlowGraphCommands, IconStore } from "@antv/xflow";
import { SaveOutlined, CheckOutlined, CodeOutlined } from "@ant-design/icons";
import type { NsGraphCmd } from "@antv/xflow";
import { Modal, DatePicker, Form, Input, Button, Space, message } from "antd";
import { ProCard, ProTable } from "@ant-design/pro-components";
import { APIS, Knowledge } from "@/services";
import { useSearchParams } from "@umijs/max";

const { RangePicker } = DatePicker;

const CheckItem = () => {
  return (
    <ProCard
      title={
        <Form layout="inline">
          <Form.Item>
            <RangePicker showTime />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary">查询</Button>
              <Button>修改</Button>
            </Space>
          </Form.Item>
        </Form>
      }
      direction="column"
      gutter={[0, 16]}
      style={{ marginBlockStart: 8 }}
      headStyle={{
        padding: 0,
      }}
      bodyStyle={{
        paddingLeft: 0,
        paddingRight: 0,
      }}
      size="small"
    >
      <ProCard bordered headerBordered split="vertical" size="small">
        <ProCard
          title="事实列表"
          headerBordered
          colSpan="50%"
          type="inner"
          headStyle={{
            paddingLeft: 0,
            paddingRight: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ height: 360 }}>
            <ProTable
              search={false}
              options={false}
              pagination={false}
              rowKey="name"
              dataSource={[
                {
                  name: "1",
                  type: "2",
                },
              ]}
              columns={[
                {
                  title: "名称",
                  dataIndex: "name",
                },
                {
                  title: "类型",
                  dataIndex: "type",
                },
              ]}
            />
          </div>
        </ProCard>
        <ProCard
          title="errorMsg"
          headerBordered
          type="inner"
          headStyle={{
            paddingLeft: 0,
            paddingRight: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ height: 360 }}>右侧内容</div>
        </ProCard>
      </ProCard>
      <ProCard type="inner" title="输出结果" bordered>
        <Input.TextArea />
      </ProCard>
    </ProCard>
  );
};

const ModalItem: React.FC<{
  modalRender?: React.ReactNode;
  tooltip?: string;
}> = (props) => {
  const { tooltip, modalRender, children } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <>
      <span
        className="x6-toolbar-item xflow-toolbar-item"
        style={{
          padding: 0,
          marginLeft: 0,
          marginRight: 0,
        }}
        onClick={() => setOpen(true)}
      >
        {children}
      </span>
      <Modal
        title={tooltip}
        open={open}
        onCancel={() => setOpen(false)}
        width="800px"
      >
        {modalRender}
      </Modal>
    </>
  );
};

namespace NsConfig {
  /** 注册icon 类型 */
  IconStore.set("SaveOutlined", SaveOutlined);
  IconStore.set("CheckOutlined", CheckOutlined);
  IconStore.set("CodeOutlined", CodeOutlined);
  /** 获取toobar配置项 */
  export const getToolbarItems: (
    T: any
  ) => Promise<IToolbarGroupOptions[]> = async (value) => {
    const toolbarGroup1: IToolbarItemOptions[] = [
      {
        id: "CheckOutlined",
        iconName: "CheckOutlined",
        tooltip: "知识校验",
        render: (props) => <ModalItem modalRender={<CheckItem />} {...props} />,
      },
      {
        id: "CodeOutlined",
        iconName: "CodeOutlined",
        tooltip: "查看代码",
        render: (props) => (
          <ModalItem modalRender={<Input.TextArea />} {...props} />
        ),
      },
    ];
    const toolbarGroup2: IToolbarItemOptions[] = [
      {
        id: XFlowGraphCommands.SAVE_GRAPH_DATA.id,
        iconName: "SaveOutlined",
        tooltip: "保存数据",
        onClick: async ({ commandService }) => {
          commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
            XFlowGraphCommands.SAVE_GRAPH_DATA.id,
            {
              saveGraphDataService: async (meta, data) => {
                console.log(data);
                if (value) {
                  const object: Knowledge = JSON.parse(value);
                  if (object?.uuid) {
                    const { success } =
                      await APIS.DefaultApi.kmsZsbjServerApiKnowledgeUpdatePut({
                        uuid: object?.uuid,
                        graphInfo: JSON.stringify(data),
                      });
                    if (success) {
                      message.success("修改成功！");
                    } else {
                      message.warning("修改失败！");
                    }
                  } else {
                    const { success } =
                      await APIS.DefaultApi.kmsZsbjServerApiKnowledgeAddPost({
                        ...object,
                        graphInfo: JSON.stringify(data),
                      });
                    if (success) {
                      message.success("新增成功！");
                    } else {
                      message.warning("新增失败！");
                    }
                  }
                }
              },
            }
          );
        },
      },
    ];

    return [
      { name: "nodeGroup", items: toolbarGroup1 },
      { name: "graphGroup", items: toolbarGroup2 },
    ];
  };
}

/** wrap出一个hook */
export const useToolbarConfig = () => {
  const [searchParams] = useSearchParams();
  const object = searchParams.get("object");
  return createToolbarConfig((toolbarConfig) => {
    /** 生产 toolbar item */
    toolbarConfig.setToolbarModelService(async (toolbarModel) => {
      const toolbarItems = await NsConfig.getToolbarItems(object);
      toolbarModel.setValue((toolbar) => {
        toolbar.mainGroups = toolbarItems;
      });
    });
  })();
};
