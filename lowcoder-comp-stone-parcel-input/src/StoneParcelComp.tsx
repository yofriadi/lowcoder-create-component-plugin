import {
  antd,
  styleControl,
  withDefault,
  UICompBuilder,
  jsonValueExposingStateControl,
  Section,
  withMethodExposing,
  withExposingConfigs,
  eventHandlerControl,
  NameConfig,
} from "lowcoder-sdk";
import { PlusOutlined } from "@ant-design/icons";
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
] as const;

interface StoneValue {
  parcel: string;
  pieces: number;
  carat: number;
}

export interface Props {
  onEvent: any;
  styles: {
    backgroundColor: string;
    margin: string;
    padding: string;
    textSize: string;
  };
  data: any; // StoneValue[]
}

let StoneParcelComp = new UICompBuilder(
  {
    data: jsonValueExposingStateControl("data", i18nObjs.defaultData),
    styles: styleControl(CompStyles),
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

    // convenient function, so that we don't need to pass index to child component
    const closureHandleChange =
      (i: number, parcelValue: StoneValue) => (k: string, v: string | number) =>
        handleChange(i, { ...parcelValue, [k]: v });
    const handleChange = (key: number, value: StoneValue): void => {
      const newParcelValues = props.data.value.map(
        (parcelValue: StoneValue, i: number): StoneValue => {
          if (i === key) {
            return value;
          }
          return parcelValue;
        },
      );
      props.data.onChange(newParcelValues);
      props.onEvent("change");
    };

    const handleAdd = () => {
      const newParcelValues = [...props.data.value, initValue];
      props.data.onChange(newParcelValues);
      props.onEvent("change");
    };

    const handleClose = (key: number) => {
      const newParcelValues = props.data.value.reduce(
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
    };

    return (
      <Container $styles={props.styles}>
        {props.data.value.map((parcelValue: StoneValue, i: number) => (
          <StoneParcel
            key={i}
            i={i}
            isOnlyOne={props.data.value.length === 1}
            handleChange={closureHandleChange(i, parcelValue)}
            handleClose={handleClose}
            styles={props.styles}
          />
        ))}
        <WrapperAddButton>
          <antd.Button
            size="large"
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          ></antd.Button>
        </WrapperAddButton>
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
        <Section name="Styles">{children.styles.getPropertyView()}</Section>
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
  height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
  margin: ${(props) => props.$styles.margin};
  padding: ${(props) => props.$styles.padding};
  background-color: ${(props) => props.$styles.backgroundColor};
  /* border: 1px solid #ddd;
  background-color: white; */
`;

const WrapperAddButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
`;
