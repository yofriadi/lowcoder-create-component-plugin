import { antd } from "lowcoder-sdk";
import styled from "styled-components";

interface Option {
  value: string;
  label: string;
}

interface Element {
  parcel: string;
  pieces: number;
  carat: number;
}

function StoneParcel({
  i,
  parcelValue: parcelValue,
  onHandleChange,
}: {
  i: number;
  parcelValue: Element;
  onHandleChange: (i: number) => void;
}) {
  return (
    <Row>
      <Wrapper>
        <Label>Parcel</Label>
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
          defaultValue={parcelValue.parcel}
          onSelect={() => onHandleChange(i)}
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
          defaultValue={parcelValue.pieces}
          onFocus={() => onHandleChange(i)}
        />
      </Wrapper>
      <Wrapper>
        <Label>Carat</Label>
        <antd.InputNumber
          style={{ margin: 3 }}
          min={1}
          max={10}
          defaultValue={parcelValue.carat}
          onFocus={() => onHandleChange(i)}
        />
      </Wrapper>
    </Row>
  );
}

export default StoneParcel;

const Row = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-grow: 1;
  width: 100%;
  margin: 7px;
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
  color: #222;

  &:hover {
    cursor: default;
  }

  &:nth-child(n + 2) {
    display: none;
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
