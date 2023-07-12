import React from "react";
import { Upload, Button } from "antd";
import { FormItemWrapper } from "./index";
import type { NsJsonSchemaForm } from "@antv/xflow";
import { UploadOutlined } from "@ant-design/icons";

export const UploadShape: React.FC<NsJsonSchemaForm.IControlProps> = (
  props
) => {
  const { controlSchema } = props;
  const { originData } = controlSchema;
  return (
    <FormItemWrapper {...props}>
      {({ disabled }) => (
        <Upload listType="picture" {...originData} disabled={disabled}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      )}
    </FormItemWrapper>
  );
};
