import { useState } from "react";
import {
  styleControl,
  withDefault,
  AutoHeightControl,
  UICompBuilder,
  Section,
} from "lowcoder-sdk";
import { PlusOutlined } from "@ant-design/icons";
import { useResizeDetector } from "react-resize-detector";
import styled from "styled-components";

import { trans } from "./i18n/comps";
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

export default new UICompBuilder(
  {
    styles: styleControl(CompStyles),
    autoHeight: withDefault(AutoHeightControl, "auto"),
  },
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
    data: any[] | null | undefined;
    autoHeight: boolean;
  }) => {
    const [parcelValues, setParcelValues] = useState([
      { parcel: "", pieces: 0, carat: 0 },
    ]);
    let handleChange = (i: number) => {
      if (i === parcelValues.length - 1) {
        setParcelValues([...parcelValues, { parcel: "", pieces: 0, carat: 0 }]);
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
      /* <div
        className={styles.wrapper}
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: `${props.styles.backgroundColor}`,
          borderColor: `${props.styles.border}`,
          borderRadius: `${props.styles.radius}`,
          borderWidth: `${props.styles.borderWidth}`,
          margin: `${props.styles.margin}`,
          padding: `${props.styles.padding}`,
          fontSize: `${props.styles.textSize}`,
        }}
        ref={conRef}
      > */
      <Container $styles={props.styles}>
        {parcelValues.map((el, i) => (
          <StoneParcel
            key={i}
            i={i}
            parcelValue={el}
            onHandleChange={handleChange}
          />
        ))}
        {/* <antd.Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
        ></antd.Button> */}
      </Container>
    );
  },
)
  .setPropertyViewFn((children: any) => {
    return (
      <>
        <Section name="Styles">
          {children.styles.getPropertyView()}
          {children.autoHeight.getPropertyView()}
        </Section>
      </>
    );
  })
  .build();

const Container = styled.div<{ $styles: any }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 5px;
  margin: ${(props) => props.$styles.margin};
  padding: ${(props) => props.$styles.padding};
  font-size: ${(props) => props.$styles.textSize};
  /*background-color: ${(props) => props.$styles.backgroundColor};
  border-color: ${(props) => props.$styles.border};
  border-radius: ${(props) => props.$styles.radius};
  border-width: ${(props) => props.$styles.borderWidth};*/
  border: 1px solid #ddd;
  background-color: white;
`;
