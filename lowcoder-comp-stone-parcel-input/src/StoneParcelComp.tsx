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
          <Row key={i}>
            <Wrapper>
              <Label>Parcel</Label>
              <antd.Select
                showSearch
                allowClear
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
                onSelect={() => handleChange(i)}
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
            </Wrapper>
            <Wrapper>
              <Label>Pieces</Label>
              <antd.InputNumber
                style={{ margin: 3 }}
                min={1}
                max={10}
                defaultValue={el.pieces}
                onFocus={() => handleChange(i)}
              />
            </Wrapper>
            <Wrapper>
              <Label>Carat</Label>
              <antd.InputNumber
                style={{ margin: 3 }}
                min={1}
                max={10}
                defaultValue={el.carat}
                onFocus={() => handleChange(i)}
              />
            </Wrapper>
          </Row>
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

const Row = styled.div`
  display: flex;
  height: 100%;
  flex-grow: 1;
  width: 100%;
  margin-top: 4px;
  height: calc(100% - 4px);
  align-items: start;
  flex-shrink: 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  user-select: none;
  font-size: 13px;
  color: #222222;

  &:hover {
    cursor: default;
  }

  /**
   * add this for tooltip
  background-image: linear-gradient(to right, #8b8fa3 50%, #fff 0%); */
  background-size: 4px 1px;
  background-position: 5px bottom;
  background-repeat: repeat-x;
  padding-left: 5px;
  padding-bottom: 2.5px !important;
  width: fit-content;
  user-select: text;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
`;
