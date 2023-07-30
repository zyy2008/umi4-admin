import React from "react";
import { Select as ASelect, SelectProps } from "antd";
import { FormItemWrapper } from "./index";
import type { NsJsonSchemaForm } from "@antv/xflow";
import { useRequest } from "@umijs/max";

interface IOption {
  title: string;
  value: string | number | boolean;
}

export const SelectShape: React.FC<NsJsonSchemaForm.IControlProps> = (
  props
) => {
  const { controlSchema } = props;
  const { originData, options: initOptions } = controlSchema;
  const { service, ...others } = (originData as SelectProps & {
    service?: (...args: any) => Promise<IOption[]>;
  }) ?? { service: undefined };
  const { data, loading } = service
    ? useRequest(service, {
        formatResult: (res) => {
          return res;
        },
      })
    : { data: null, loading: false };

  const options = React.useMemo<IOption[]>(() => {
    if (data) {
      return data as IOption[];
    }
    return [];
  }, [initOptions, data]);

  return (
    <FormItemWrapper {...props}>
      {({ disabled, placeholder }) => (
        <ASelect
          {...others}
          disabled={disabled}
          placeholder={placeholder}
          loading={loading}
          showSearch
          filterOption={(input, option) =>
            ((option?.label as string) ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {options?.map((option, index) => {
            const { title, value } = option;
            return (
              <ASelect.Option key={index} value={value as any}>
                {title}
              </ASelect.Option>
            );
          })}
        </ASelect>
      )}
    </FormItemWrapper>
  );
};
