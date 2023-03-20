import React from "react";
import { Card, Select, SelectProps, Input, Radio, CardProps } from "antd";
import { NsJsonSchemaForm, useXFlowApp } from "@antv/xflow";
import { Graph } from "@antv/x6";
import { EditorShape } from "./custom-editor";
import { LabelShape } from "./custom-label";
import { FormListShape } from "./custom-list";
import { TagsShape } from "./custom-tags";
import { SaveShape } from "./custom-save";
import { NumberShape } from "./custom-number";
import { ListSelectShape } from "./custom-list-select";
import { ListTableShape } from "./custom-list-table";
import { MultiInputShape } from "./custom-multi-input";
import { Context } from "@/pages/edit";
import { ParamBean } from "@/services";
import styles from "./styles.less";

const { Search } = Input;

/** 自定义form控件 */
export enum ControlShapeEnum {
  EDITOR_SHAPE = "EDITOR",
  TEXT_SHAPE = "TEXT",
  LIST_SHAPE = "LIST",
  TAGS_SHAPE = "SELECT-TAGS",
  SAVE_SHAPE = "SAVE",
  NUMBER_SHAPE = "NUMBER",
  LIST_SELECT_SHAPE = "LIST-SELECT",
  LIST_TABLE_SHAPE = "LIST-TABLE",
  MULTI_INPUT_SHAPE = "MULTI_INPUT",
}

export const controlMapService: NsJsonSchemaForm.IControlMapService = (
  controlMap
) => {
  controlMap.set(ControlShapeEnum.EDITOR_SHAPE, EditorShape);
  controlMap.set(ControlShapeEnum.TEXT_SHAPE, LabelShape);
  controlMap.set(ControlShapeEnum.LIST_SHAPE, FormListShape);
  controlMap.set(ControlShapeEnum.TAGS_SHAPE, TagsShape);
  controlMap.set(ControlShapeEnum.SAVE_SHAPE, SaveShape);
  controlMap.set(ControlShapeEnum.NUMBER_SHAPE, NumberShape);
  controlMap.set(ControlShapeEnum.LIST_SELECT_SHAPE, ListSelectShape);
  controlMap.set(ControlShapeEnum.LIST_TABLE_SHAPE, ListTableShape);
  controlMap.set(ControlShapeEnum.MULTI_INPUT_SHAPE, MultiInputShape);
  return controlMap;
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

export const SelectMulti: React.FC<SelectProps> = (props) => {
  const [data, setData] = React.useState<ParamBean[]>([]);
  const options = React.useMemo<SelectProps["options"]>(() => {
    if (data.length > 0) {
      return data.map((item) => ({ label: item.tmName, value: item.tmCode }));
    }
    return [];
  }, [data]);
  return (
    <Select
      {...props}
      placeholder="请选择"
      options={options}
      popupClassName={styles["multi-select"]}
      dropdownRender={(menus) => (
        <>
          <CardRadio
            onChange={setData}
            headStyle={{
              padding: "0px 10px",
            }}
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
};

type RadioValue = "params" | "var" | "result" | "entry" | "function";

export const CardRadio: React.FC<CardRadioProps> = (props) => {
  const { isRadio = true, onChange, headStyle } = props;
  const app = useXFlowApp();
  const ctx = React.useContext(Context);
  const [value, setValue] = React.useState<RadioValue>("params");
  const [graph, setGraph] = React.useState<Graph>();
  const [keyword, setKeyword] = React.useState<string>("");
  React.useEffect(() => {
    (async () => {
      const graph: Graph = await app.getGraphInstance();
      setGraph(graph);
    })();
  }, []);

  React.useEffect(() => {
    let list: ParamBean[] = [];
    if (value === "params") {
      if (ctx?.params) {
        list = ctx.params;
      }
    } else {
      if (graph) {
        const [cell] = graph.getSelectedCells();
        const predecessors = graph.getPredecessors(cell);
        const processCells = predecessors.filter((cell) => {
          const { renderKey } = cell.getData();
          if (value === "var") {
            return renderKey === "ProcessNode";
          }
          if (value === "result") {
            return renderKey === "PreparationNode";
          }
          if (value === "entry") {
            return renderKey === "StartNode";
          }
          if (value === "function") {
            return renderKey === "MultiDocumentNode";
          }
          return false;
        });
        if (value === "entry") {
          const [cell] = processCells;
          if (cell) {
            const {
              input,
            }: { input: { name: string; type: string; value: string }[] } =
              cell.getData();
            for (let i = 0; i < input.length; i++) {
              const { name } = input[i];
              if (name) {
                list.push({
                  tmCode: name,
                  tmName: name,
                });
              }
            }
          }
        } else {
          for (let i = 0; i < processCells.length; i++) {
            const { name } = processCells[i].getData();
            if (name) {
              list.push({
                tmCode: name,
                tmName: name,
              });
            }
          }
        }
      }
    }
    const filters = list.filter((node) => node.tmName?.includes(keyword)) ?? [];
    onChange?.(filters);
  }, [ctx?.params, graph, value, keyword, onChange]);
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
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
            buttonStyle="solid"
          >
            <Radio.Button value="params">参数</Radio.Button>
            <Radio.Button value="entry">入参</Radio.Button>
            <Radio.Button value="var">变量</Radio.Button>
            <Radio.Button value="function">返回</Radio.Button>
            <Radio.Button value="result">结果</Radio.Button>
          </Radio.Group>
        )
      }
    />
  );
};
