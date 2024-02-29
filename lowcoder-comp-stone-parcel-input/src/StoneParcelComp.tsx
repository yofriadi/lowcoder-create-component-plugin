import { useState } from "react";
import {
  antd,
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
import styles from "./styles.module.css";

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

interface Option {
  value: string;
  label: string;
}

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
    const [formValues, setFormValues] = useState([
      { parcel: "", pieces: 0, carat: 0 },
    ]);
    let handleChange = (i: number) => {
      if (i === formValues.length - 1 && i >= 0) {
        setFormValues([...formValues, { parcel: "", pieces: 0, carat: 0 }]);
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
      <Container $styles={props.styles} ref={conRef}>
        {formValues.map((el, i) => (
          <Wrapper key={i}>
            <antd.Select
              showSearch
              style={{ width: 200, margin: 4 }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input: string, option: Option): boolean =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA: Option, optionB: Option) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              defaultValue={el.parcel}
              onFocus={() => handleChange(i)}
              options={[
                {
                  value: "1",
                  label: "Not Identified",
                },
                {
                  value: "2",
                  label: "Closed",
                },
                {
                  value: "3",
                  label: "Communicated",
                },
                {
                  value: "4",
                  label: "Identified",
                },
                {
                  value: "5",
                  label: "Resolved",
                },
                {
                  value: "6",
                  label: "Cancelled",
                },
              ]}
            />
            <antd.InputNumber
              style={{ margin: 3 }}
              min={1}
              max={10}
              defaultValue={el.pieces}
              onFocus={() => handleChange(i)}
            />
            <antd.InputNumber
              style={{ margin: 3 }}
              min={1}
              max={10}
              defaultValue={el.carat}
              onFocus={() => handleChange(i)}
            />
          </Wrapper>
        ))}
        <antd.Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
        ></antd.Button>
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
  height: auto;
  width: auto;
  padding: 5px;
  display: flex;
  flex-direction: column;
  margin: ${(props) => props.$styles.margin};
  padding: ${(props) => props.$styles.padding};
  fontsize: ${(props) => props.$styles.textSize};
  /* backgroundcolor: ${(props) => props.$styles.backgroundColor};
  bordercolor: ${(props) => props.$styles.border};
  borderradius: ${(props) => props.$styles.radius};
  borderwidth: ${(props) => props.$styles.borderWidth}; */
  border: 1px solid #dddddd;
  background-color: white;
`;

const Wrapper = styled.div`
  display: flex;
`;
