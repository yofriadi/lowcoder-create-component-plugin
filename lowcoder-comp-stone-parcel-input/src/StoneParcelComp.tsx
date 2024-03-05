import { useEffect, useState } from "react";
import {
  antd,
  styleControl,
  withDefault,
  AutoHeightControl,
  UICompBuilder,
  jsonValueExposingStateControl,
  Section,
  withMethodExposing,
  withExposingConfigs,
  eventHandlerControl,
  NameConfig,
} from "lowcoder-sdk";
import { PlusOutlined } from "@ant-design/icons";
import { useResizeDetector } from "react-resize-detector";
import styled from "styled-components";

import { i18nObjs, trans } from "./i18n/comps";
import { StoneParcel } from "./vendors";

export const CompStyles = [
  {
    name: "margin",
    label: trans("style.margin"),
    margin: "margin",
  },
  {
    name: "padding",
    label: trans("style.padding"),
    padding: "padding",
  },
  {
    name: "textSize",
    label: trans("style.textSize"),
    textSize: "textSize",
  },
  {
    name: "backgroundColor",
    label: trans("style.backgroundColor"),
    backgroundColor: "backgroundColor",
  },
  {
    name: "border",
    label: trans("style.border"),
    border: "border",
  },
  {
    name: "radius",
    label: trans("style.borderRadius"),
    radius: "radius",
  },
  {
    name: "borderWidth",
    label: trans("style.borderWidth"),
    borderWidth: "borderWidth",
  },
] as const;

export interface StoneValue {
  parcel: string;
  pieces: number;
  carat: number;
}

interface Props {
  onEvent: any;
  styles: {
    backgroundColor: string;
    border: string;
    radius: string;
    borderWidth: string;
    margin: string;
    padding: string;
    textSize: string;
  };
  data: any;
  autoHeight: boolean;
}

let StoneParcelComp = new UICompBuilder(
  {
    data: jsonValueExposingStateControl("data", i18nObjs.defaultData),
    styles: styleControl(CompStyles),
    autoHeight: withDefault(AutoHeightControl, "auto"),
    onEvent: eventHandlerControl([
      {
        label: "onChange",
        value: "change",
        description: "Triggers when data changes",
      },
    ] as const),
  },
  (props: Props) => {
    const initValue: StoneValue = { parcel: "", pieces: 0, carat: 0 };
    const [parcelValues, setParcelValues] = useState<Array<StoneValue>>([
      { ...initValue },
    ]);

    useEffect(() => {
      console.log(props.data.value);
      if (props.data.length) {
        setParcelValues(props.data.value);
      }
    }, [props.data, parcelValues]);

    // convenient function, so that we don't need to pass index to child component
    const closureHandleChange =
      (i: number, parcelValue: StoneValue) => (k: string, v: string | number) =>
        handleChange(i, { ...parcelValue, [k]: v });
    const handleChange = (key: number, value: StoneValue) => {
      setParcelValues((parcelValues: StoneValue[]): StoneValue[] => {
        const newParcelValues = parcelValues.map(
          (parcelValue: StoneValue, i: number): StoneValue => {
            if (i === key) {
              return value;
            }
            return parcelValue;
          },
        );
        props.data.onChange(newParcelValues);
        props.onEvent("change");
        return newParcelValues;
      });
    };

    const handleAdd = () => {
      setParcelValues((parcelValues: StoneValue[]) => {
        const newParcelValues = [...parcelValues, initValue];
        props.data.onChange(newParcelValues);
        props.onEvent("change");
        return newParcelValues;
      });
    };

    // convenient function, so that we don't need to pass index to child component
    const closureHandleClose = (i: number) => () => handleClose(i);
    const handleClose = (key: number) => {
      setParcelValues((parcelValues: StoneValue[]): StoneValue[] => {
        const newParcelValues = parcelValues.reduce(
          (acc: StoneValue[], curr: StoneValue, i: number): StoneValue[] => {
            if (i !== key) {
              acc.push(curr);
            }
            return acc;
          },
          [],
        );
        props.data.onChange(newParcelValues);
        props.onEvent("change");
        return newParcelValues;
      });
    };

    const [dimensions, setDimensions] = useState({ width: 480, height: 280 });
    const {
      width,
      height,
      ref: conRef,
    } = useResizeDetector({
      onResize: () => {
        const container = conRef.current;
        if (!container || !width || !height) return;

        if (props.autoHeight) {
          setDimensions({ width, height: dimensions.height });
          return;
        }

        setDimensions({ width, height });
      },
    });

    return (
      <Container ref={conRef} $styles={props.styles}>
        {parcelValues.map((parcelValue, i) => (
          <StoneParcel
            key={i}
            handleChange={closureHandleChange(i, parcelValue)}
            handleClose={closureHandleClose(i)}
          />
        ))}
        <antd.Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        ></antd.Button>
      </Container>
    );
  },
)
  .setPropertyViewFn((children: any) => {
    return (
      <>
        <Section name="Basic">
          {children.data.propertyView({ label: "Initial Data" })}
        </Section>
        <Section name="Interaction">{children.onEvent.propertyView()}</Section>
        <Section name="Styles">
          {children.styles.getPropertyView()}
          {children.autoHeight.getPropertyView()}
        </Section>
      </>
    );
  })
  .build();

StoneParcelComp = withMethodExposing(StoneParcelComp, [
  {
    method: {
      name: "setValue",
      description: trans("methods.setValue"),
      params: [
        {
          name: "data",
          type: "JSON",
          description: "JSON value",
        },
      ],
    },
    execute: (comp: any, values: any[]) => {
      const value = values[0] as StoneValue;
      if (typeof value !== "object") {
        return Promise.reject(trans("methods.invalidInput"));
      }
      if (!value.parcel) {
        return Promise.reject(
          trans("methods.requiredField", { field: "parcel" }),
        );
      }
      if (!value.pieces) {
        return Promise.reject(
          trans("methods.requiredField", { field: "pieces" }),
        );
      }
      if (!value.carat) {
        return Promise.reject(
          trans("methods.requiredField", { field: "carat" }),
        );
      }
      const data = comp.children.data.getView();
      const newData = [...data, value];
      comp.children.data.dispatchChangeValueAction(
        JSON.stringify(newData, null, 2),
      );
    },
  },
]);

export default withExposingConfigs(StoneParcelComp, [
  new NameConfig("data", trans("component.data")),
]);

const Container = styled.div<{ $styles: any }>`
  height: 100%;
  width: 100%;
  margin: ${(props) => props.$styles.margin};
  padding: ${(props) => props.$styles.padding};
  font-size: ${(props) => props.$styles.textSize};
  background-color: ${(props) => props.$styles.backgroundColor};
  border-color: ${(props) => props.$styles.border};
  border-radius: ${(props) => props.$styles.radius};
  border-width: ${(props) => props.$styles.borderWidth};
  /* border: 1px solid #ddd;
  background-color: white; */
`;
