import React from "react";
import { Card, Select, SelectProps, Input, Radio, Tooltip, Form } from "antd";
import {
  NsJsonSchemaForm,
  useXFlowApp,
  FormItemWrapper as Wrapper,
} from "@antv/xflow";
import { Graph } from "@antv/x6";
import { EditorShape } from "./custom-editor";
import { LabelShape } from "./custom-label";
import { FormListShape } from "./custom-list";
import { SelectShape } from "./custom-select";
import { SaveShape } from "./custom-save";
import { NumberShape } from "./custom-number";
import { ListSelectShape } from "./custom-list-select";
import { ListTableShape } from "./custom-list-table";
import { MultiInputShape } from "./custom-multi-input";
import { InputShape } from "./custom-input";
import { UploadShape } from "./custom-upload";
import { Context } from "@/pages/edit";
import { ParamBean } from "@/services";
import styles from "./styles.less";

const { Search } = Input;

/** 自定义form控件 */
export enum ControlShapeEnum {
  EDITOR_SHAPE = "EDITOR",
  TEXT_SHAPE = "TEXT",
  LIST_SHAPE = "LIST",
  SELECT_SHAPE = "NEW-SELECT",
  SAVE_SHAPE = "SAVE",
  NUMBER_SHAPE = "NUMBER",
  LIST_SELECT_SHAPE = "LIST-SELECT",
  LIST_TABLE_SHAPE = "LIST-TABLE",
  MULTI_INPUT_SHAPE = "MULTI_INPUT",
  INPUT_SHAPE = "NEW-INPUT",
  UPLOAD_SHAPE = "UPLOAD",
}

export const controlMapService: NsJsonSchemaForm.IControlMapService = (
  controlMap
) => {
  controlMap.set(ControlShapeEnum.EDITOR_SHAPE, EditorShape);
  controlMap.set(ControlShapeEnum.TEXT_SHAPE, LabelShape);
  controlMap.set(ControlShapeEnum.LIST_SHAPE, FormListShape);
  controlMap.set(ControlShapeEnum.SELECT_SHAPE, SelectShape);
  controlMap.set(ControlShapeEnum.SAVE_SHAPE, SaveShape);
  controlMap.set(ControlShapeEnum.NUMBER_SHAPE, NumberShape);
  controlMap.set(ControlShapeEnum.LIST_SELECT_SHAPE, ListSelectShape);
  controlMap.set(ControlShapeEnum.LIST_TABLE_SHAPE, ListTableShape);
  controlMap.set(ControlShapeEnum.MULTI_INPUT_SHAPE, MultiInputShape);
  controlMap.set(ControlShapeEnum.INPUT_SHAPE, InputShape);
  controlMap.set(ControlShapeEnum.UPLOAD_SHAPE, UploadShape);
  return controlMap;
};

export function renderFormItemExtra(title?: string) {
  if (!title) {
    return undefined;
  }
  return <Tooltip title={title} />;
}

type CalculatedData = Pick<
  NsJsonSchemaForm.IControlSchema,
  "placeholder" | "options" | "disabled"
>;

const Fields = (props: {
  children: React.ReactElement;
  initialValue: any;
  onChange?: (T: any) => void;
}) => {
  const { children, initialValue, ...others } = props;
  const { onChange } = others;
  React.useEffect(() => {
    if (initialValue) {
      onChange?.(initialValue);
    }
  }, []);
  return React.cloneElement(children, others);
};

export const FormItemWrapper: React.FC<
  NsJsonSchemaForm.IControlProps & {
    children: (data: CalculatedData) => React.ReactElement;
  }
> = (props) => {
  const { controlSchema, children } = props;
  const {
    required,
    tooltip,
    extra,
    name,
    label,
    placeholder,
    options = [],
    rules,
  } = controlSchema;

  return (
    <Wrapper schema={controlSchema}>
      {({ hidden, disabled, initialValue }) => {
        return (
          <Form.Item
            name={name}
            label={label}
            initialValue={initialValue}
            tooltip={tooltip}
            extra={renderFormItemExtra(extra)}
            required={required}
            hidden={hidden}
            rules={rules}
          >
            {children({ placeholder, options, disabled })}
          </Form.Item>
        );
      }}
    </Wrapper>
  );
};

export const SelectMids: React.FC<SelectProps> = (props) => {
  const ctx = React.useContext(Context);
  const options = React.useMemo<SelectProps["options"]>(() => {
    if (ctx?.params) {
      return ctx?.params?.map((item) => ({
        label: item.tmName,
        value: item.tmCode,
      }));
    }
    return [];
  }, [ctx?.params]);
  return <Select {...props} options={options} />;
};

export const SelectMulti: React.FC<
  SelectProps & { onRadioValue?: (T: RadioValue) => void; radioValue?: string }
> = (props) => {
  const { onRadioValue, radioValue, ...others } = props;
  const [data, setData] = React.useState<ParamBean[]>([]);
  const options = React.useMemo<SelectProps["options"]>(() => {
    if (data.length > 0) {
      return data.map((item) => {
        if (item.satCode) {
          return {
            label: item.tmName,
            value: `${item.satCode}.${item.tmCode}`,
          };
        }
        return { label: item.tmName, value: item.tmCode };
      });
    }
    return [];
  }, [data]);
  return (
    <Select
      {...others}
      placeholder="请选择"
      options={options}
      popupClassName={styles["multi-select"]}
      dropdownMatchSelectWidth={225}
      maxTagTextLength={3}
      dropdownRender={(menus) => (
        <>
          <CardRadio
            onChange={setData}
            headStyle={{
              padding: "0px 10px",
            }}
            onRadioValue={onRadioValue}
            radioValue={radioValue}
          />
          {menus}
        </>
      )}
    />
  );
};

type CardRadioProps = {
  isRadio?: boolean;
  onChange: (T: ParamBean[]) => void;
  headStyle?: React.CSSProperties;
  onRadioValue?: (T: RadioValue) => void;
  radioValue?: string;
};

type RadioValue = "params" | "var" | "result" | "useParams" | "function";

export const CardRadio: React.FC<CardRadioProps> = (props) => {
  const {
    isRadio = true,
    onChange,
    headStyle,
    onRadioValue,
    radioValue,
  } = props;
  const app = useXFlowApp();
  const ctx = React.useContext(Context);
  const [value, setValue] = React.useState<RadioValue>("params");
  const [graph, setGraph] = React.useState<Graph>();
  const [keyword, setKeyword] = React.useState<string>("");

  const useValue = React.useMemo<string>(() => {
    if (radioValue) {
      return radioValue;
    }
    return value;
  }, [value, radioValue]);

  React.useEffect(() => {
    (async () => {
      const graph: Graph = await app.getGraphInstance();
      setGraph(graph);
    })();
  }, []);

  React.useEffect(() => {
    let list: ParamBean[] = [];
    if (useValue === "params") {
      if (ctx?.params) {
        list = ctx.params;
      }
    } else {
      if (graph) {
        const [cell] = graph.getSelectedCells();
        const predecessors = graph.getPredecessors(cell);
        const processCells = predecessors.filter((cell) => {
          const { renderKey } = cell.getData();
          if (useValue === "var") {
            return renderKey === "ProcessNode";
          }
          if (useValue === "result") {
            return renderKey === "PreparationNode";
          }
          if (useValue === "useParams") {
            return renderKey === "ConnectorNode";
          }
          if (useValue === "function") {
            return renderKey === "MultiDocumentNode";
          }
          return false;
        });
        for (let i = 0; i < processCells.length; i++) {
          const data = processCells[i].getData();
          const name = data?.name;
          if (name) {
            list.push({
              tmCode: name,
              tmName: name,
            });
          }
        }
      }
    }
    const filters = list.filter((node) => node.tmName?.includes(keyword)) ?? [];
    onChange?.(filters);
  }, [ctx?.params, graph, useValue, keyword, onChange]);
  return (
    <Card
      bordered={false}
      headStyle={{
        padding: 0,
        ...headStyle,
      }}
      bodyStyle={{
        padding: 0,
        textAlign: "center",
      }}
      title={
        <Search
          onSearch={setKeyword}
          allowClear
          placeholder="过滤条件"
          size="small"
        />
      }
      children={
        isRadio && (
          <Radio.Group
            value={useValue}
            onChange={({ target: { value } }) => {
              setValue(value);
              onRadioValue?.(value);
            }}
            buttonStyle="solid"
          >
            <Radio.Button value="params">全参</Radio.Button>
            <Radio.Button value="useParams">参数</Radio.Button>
            <Radio.Button value="var">变量</Radio.Button>
            <Radio.Button value="function">返回</Radio.Button>
            <Radio.Button value="result">结果</Radio.Button>
          </Radio.Group>
        )
      }
    />
  );
};
