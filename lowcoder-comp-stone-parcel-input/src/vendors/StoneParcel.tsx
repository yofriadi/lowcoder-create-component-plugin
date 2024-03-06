import { antd } from "lowcoder-sdk";
import { CloseOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Props } from "../StoneParcelComp";

interface Option {
  value: string;
  label: string;
}

function StoneParcel({
  i,
  isOnlyOne,
  handleChange,
  handleClose,
  styles,
}: {
  i: number;
  isOnlyOne: boolean;
  handleChange: (k: string, v: string | number) => void;
  handleClose: (i: number) => void;
  styles: Props["styles"];
}) {
  return (
    <Row>
      <Wrapper>
        {i === 0 && <Label $styles={styles}>Parcel</Label>}
        <antd.Select
          showSearch
          allowClear
          style={{ width: 200, margin: 4 }}
          placeholder="Search to Select"
          optionFilterProp="children"
          filterOption={(input: string, opt: Option): boolean =>
            (opt?.label ?? "").includes(input)
          }
          filterSort={(optA: Option, optB: Option) =>
            (optA?.label ?? "")
              .toLowerCase()
              .localeCompare((optB?.label ?? "").toLowerCase())
          }
          onChange={(v: string) => handleChange("parcel", v)}
          options={[
            {
              value: "Not Identified",
              label: "Not Identified",
            },
            {
              value: "Closed",
              label: "Closed",
            },
            {
              value: "Communicated",
              label: "Communicated",
            },
            {
              value: "Identified",
              label: "Identified",
            },
            {
              value: "Resolved",
              label: "Resolved",
            },
            {
              value: "Cancelled",
              label: "Cancelled",
            },
          ]}
        />
      </Wrapper>
      <Wrapper>
        {i === 0 && <Label $styles={styles}>Pieces</Label>}
        <antd.InputNumber
          style={{ margin: 3 }}
          min={1}
          max={10}
          defaultValue={0}
          onChange={(v: number) => handleChange("pieces", v)}
        />
      </Wrapper>

      <Wrapper>
        {i === 0 && <Label $styles={styles}>Carat</Label>}
        <WrapperCloseButton>
          <antd.InputNumber
            style={{ margin: 3 }}
            min={1}
            max={10}
            defaultValue={0}
            onChange={(v: number) => handleChange("carat", v)}
          />
          {!isOnlyOne && (
            <antd.Button
              danger
              size="small"
              type="primary"
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => handleClose(i)}
            ></antd.Button>
          )}
        </WrapperCloseButton>
      </Wrapper>
    </Row>
  );
}

export default StoneParcel;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const WrapperCloseButton = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.span<{ $styles: any }>`
  user-select: none;
  font-size: ${(props) => props.$styles.textSize};
  color: #222;

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
