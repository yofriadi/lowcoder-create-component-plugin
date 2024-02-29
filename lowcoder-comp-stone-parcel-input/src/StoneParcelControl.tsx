import { MultiCompBuilder, StringControl } from "lowcoder-sdk";
import styled, { css } from "styled-components";
import { isEmpty } from "lodash";
import { default as AntdTooltip, TooltipProps } from "antd/es/tooltip";

import { trans } from "./i18n/comps";

export const LabelControl = new MultiCompBuilder(
  {
    // text: withDefault(StringControl, trans("label")),
    tooltip: StringControl,
    // hidden: BoolControl,
    // width: withDefault(NumberControl, 33),
    // widthUnit: dropdownControl(WidthUnitOptions, "%"),
    //position: dropdownControl(PositionOptions, "row"),
    // align: dropdownControl(AlignOptions, "left"),
  },
  (props) => (args) => (
    <LabelViewWrapper $style={args.style}>
      <MainWrapper
        $position={props.position}
        $hasLabel={!!props.text}
        style={{
          margin: args && args.style ? args?.style?.margin : 0,
          // padding: args && args.style ? args?.style?.padding : 0,
          width: widthCalculator(
            args && args.style ? args?.style?.margin : "0px",
          ),
          height: heightCalculator(
            args && args.style ? args?.style?.margin : "0px",
          ),
        }}
      >
        {!props.hidden && !isEmpty(props.text) && (
          <LabelWrapper
            $align={props.align}
            style={{
              width:
                props.position === "row"
                  ? getLabelWidth(props.width, props.widthUnit)
                  : "100%",
              maxWidth: props.position === "row" ? "70%" : "100%",
              fontSize: args && args.style ? args?.style?.textSize : "14px",
            }}
            $position={props.position}
            $hasToolTip={!!props.tooltip}
          >
            <Tooltip
              title={
                props.tooltip && (
                  <TooltipWrapper>{props.tooltip}</TooltipWrapper>
                )
              }
              arrow={{
                pointAtCenter: true,
              }}
              placement="top"
              color="#2c2c2c"
              getPopupContainer={(node: any) =>
                node.closest(".react-grid-item")
              }
            >
              <Label $border={!!props.tooltip}>{props.text}</Label>
            </Tooltip>
            {args.required && <StyledStarIcon />}
          </LabelWrapper>
        )}
        <ChildrenWrapper
          style={{
            width:
              props.position === "row"
                ? `calc(100% - ${getLabelWidth(props.width, props.widthUnit)} - 8px)`
                : "100%",
            height:
              props.position === "column" && !!props.text
                ? "calc(100% - 22px)"
                : "100%",
          }}
        >
          {args.children}
        </ChildrenWrapper>
      </MainWrapper>

      {/* {args.help && (
        <HelpWrapper
          $marginLeft={
            props.position === "column" || isEmpty(props.text) || props.hidden
              ? "0"
              : `calc(min(${getLabelWidth(props.width, props.widthUnit)} , 70%) + 8px)`
          }
          $color={
            args.validateStatus === "error"
              ? red.primary
              : args.validateStatus === "warning"
              ? yellow.primary
              : green.primary
          }
        >
          {args.help}
        </HelpWrapper>
      )} */}
    </LabelViewWrapper>
  ),
)
  .setPropertyViewFn((children) => (
    <Section name={trans("label")}>
      {children.text.propertyView({ label: trans("labelProp.text") })}
      {children.tooltip.propertyView({ label: trans("labelProp.tooltip") })}
      {children.position.propertyView({
        label: trans("labelProp.position"),
        radioButton: true,
      })}
      {children.align.propertyView({
        label: trans("labelProp.align"),
        radioButton: true,
      })}
      {children.position.getView() !== "column" &&
        children.width.propertyView({
          label: trans("labelProp.width"),
          tooltip: trans("labelProp.widthTooltip"),
          lastNode: children.widthUnit.propertyView({}),
        })}
    </Section>
  ))
  .build();

const LabelViewWrapper = styled.div<{ $style: any }>`
  ${(props) => props.$style && getStyle(props.$style)}
  display: flex;
  flex-direction: column;
  height: 100%;
`;

function getStyle(style: any) {
  return css`
    > div:nth-of-type(1) {
      > div:nth-of-type(1) > span {
        color: ${style.label};
      }
    }
    > div:nth-of-type(2) {
      color: ${style.validate};
    }
  `;
}

const MainWrapper = styled.div`
  flex-direction: ${(props) => props.$position};
  flex-grow: 1;
  width: 100%;
  margin-top: ${(props) =>
    props.$position === "column" && props.$hasLabel ? "4px" : 0};
  height: ${(props) =>
    props.$position === "column" && props.$hasLabel
      ? "calc(100% - 4px)"
      : "100%"};
  display: flex;
  align-items: ${(props) => (props.$position === "row" ? "center" : "start")};
  flex-shrink: 0;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
  margin-bottom: ${(props) => (props.$position === "row" ? 0 : "3.5px")};
  justify-content: ${(props) => (props.$align === "left" ? "start" : "end")};
  max-width: ${(props) => (props.$position === "row" ? "80%" : "100%")};
  flex-shrink: 0;
`;

const TooltipWrapper = styled.span`
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
`;

const ChildrenWrapper = styled.div`
  flex-grow: 1;
  min-width: calc(30% - 8px);
`;

const Label = styled.span<{ $border: boolean }>`
  ${labelCss};
  ${(props) => props.$border && UnderlineCss};
  width: fit-content;
  user-select: text;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
`;

function getLabelWidth(width: number, widthUnit: string): string {
  if (width <= 0 || isNaN(width)) {
    return "0%";
  }
  return width + widthUnit;
}

function Tooltip(props: TooltipProps) {
  return (
    <AntdTooltip
      color="#2c2c2c2"
      overlayInnerStyle={overlayInnerCss}
      {...props}
    />
  );
}

export function widthCalculator(margin: string) {
  const marginArr = margin?.trim().replace(/\s+/g, " ").split(" ") || "";
  if (marginArr.length === 1) {
    return `calc(100% - ${
      parseInt(margin.replace(/[^\d.]/g, "")) * 2 +
      (margin.replace(/[0-9]/g, "") || "px")
    })`;
  } else if (marginArr.length === 2 || marginArr.length === 3) {
    return `calc(100% - ${
      parseInt(marginArr[1].replace(/[^\d.]/g, "")) * 2 +
      (marginArr[1].replace(/[0-9]/g, "") || "px")
    })`;
  } else {
    return `calc(100% - ${
      parseInt(marginArr[1]?.replace(/[^\d.]/g, "") || "0") +
      (marginArr[1]?.replace(/[0-9]/g, "") || "px")
    } - ${
      parseInt(marginArr[3]?.replace(/[^\d.]/g, "") || "0") +
      (marginArr[3]?.replace(/[0-9]/g, "") || "px")
    })`;
  }
}

export function heightCalculator(margin: string) {
  const marginArr = margin?.trim().split(" ") || "";
  if (marginArr.length === 1 || marginArr.length === 2) {
    return `calc(100% - ${
      parseInt(marginArr[0].replace(/[^\d.]/g, "")) * 2 +
      (marginArr[0].replace(/[0-9]/g, "") || "px")
    })`;
  } else if (marginArr.length > 2) {
    return `calc(100% - ${
      parseInt(marginArr[0]?.replace(/[^\d.]/g, "") || "0") +
      (marginArr[0]?.replace(/[0-9]/g, "") || "px")
    } - ${
      parseInt(marginArr[2]?.replace(/[^\d.]/g, "") || "0") +
      (marginArr[2]?.replace(/[0-9]/g, "") || "px")
    })`;
  }
}
