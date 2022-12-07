import React from "react";
import { Form as BaseForm } from "antd";
import { NsJsonSchemaForm, NsJsonSchemaFormModel } from "@antv/xflow";

const { Item } = BaseForm;

const Form: React.FC<NsJsonSchemaForm.ICustomProps> = (props) => {
  const { modelService } = props;
  React.useEffect(() => {
    (async () => {
      const model = await modelService.awaitModel(NsJsonSchemaFormModel.id);
      model.setValue({
        loading: true,
      });
    })();
  }, []);

  return (
    <BaseForm>
      <Item></Item>
    </BaseForm>
  );
};

export default Form;
