import { useState } from "react";
import {
  styleControl,
  withDefault,
  AutoHeightControl,
  UICompBuilder,
  toJSONObjectArray,
  jsonControl,
  Section,
  withMethodExposing,
  withExposingConfigs,
  eventHandlerControl,
  NameConfig,
} from "lowcoder-sdk";
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

let StoneParcelComp = (function () {
  var _skipRedraw = false;
  const skipRedraw = function () {
    var ret = _skipRedraw;
    _skipRedraw = false;
    return ret;
  };
  const childrenMap = {
    data: jsonControl(toJSONObjectArray, i18nObjs.defaultData),
    styles: styleControl(CompStyles),
    autoHeight: withDefault(AutoHeightControl, "auto"),
    onEvent: eventHandlerControl([
      {
        label: "onChange",
        value: "change",
        description: "Triggers when bpmn data changes",
      },
    ] as const),
  };
  return new UICompBuilder(
    childrenMap,
    (props: {
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
      data: StoneValue[] | null | undefined;
      autoHeight: boolean;
    }) => {
      const initvalue: StoneValue = { parcel: "", pieces: 0, carat: 0 };
      const [parcelValues, setParcelValues] = useState([{ ...initvalue }]);
      let handleChange = (id: number, key: string, val: string | number) => {
        _skipRedraw = true;
        props.onEvent("change");

        parcelValues.map((v, i) => {
          if (i === id) {
            parcelValues[i] = { ...v, [key]: val };
            setParcelValues(parcelValues);
          }
        });

        if (id === parcelValues.length - 1) {
          setParcelValues([...parcelValues, { ...initvalue }]);
        }
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
          {parcelValues.map((el, i) => (
            <StoneParcel
              key={i}
              i={i}
              parcelValue={el}
              onHandleChange={handleChange}
              skipRedraw={skipRedraw}
            />
          ))}
        </Container>
      );
    },
  )
    .setPropertyViewFn((children: any) => {
      return (
        <>
          <Section name="Basic">
            {children.data.propertyView({ label: "Data" })}
          </Section>
          <Section name="Interaction">
            {children.onEvent.propertyView()}
          </Section>
          <Section name="Styles">
            {children.styles.getPropertyView()}
            {children.autoHeight.getPropertyView()}
          </Section>
        </>
      );
    })
    .build();
})();

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
