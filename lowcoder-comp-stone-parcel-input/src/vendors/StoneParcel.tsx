import { useState, useEffect } from "react";
import { antd } from "lowcoder-sdk";
import { CloseOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { StoneValue } from "../StoneParcelComp";

interface Option {
  value: string;
  label: string;
}

function StoneParcel({
  key,
  i,
  data,
  parcelValue,
  handleChange,
  handleClose,
}: {
  key: number;
  i: number;
  data: StoneValue[];
  parcelValue: StoneValue;
  handleChange: (i: number, parcelValue: StoneValue) => void;
  handleClose: (i: number) => void;
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
          onChange={(v: string) =>
            handleChange(i, { ...parcelValue, parcel: v })
          }
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
        <Label>Pieces</Label>
        <antd.InputNumber
          style={{ margin: 3 }}
          min={1}
          max={10}
          defaultValue={parcelValue.pieces}
          onChange={(v: number) =>
            handleChange(i, { ...parcelValue, pieces: v })
          }
        />
      </Wrapper>
      <Wrapper>
        <Label>Carat</Label>
        <antd.InputNumber
          style={{ margin: 3 }}
          min={1}
          max={10}
          defaultValue={parcelValue.carat}
          onChange={(v: number) =>
            handleChange(i, { ...parcelValue, carat: v })
          }
        />
      </Wrapper>
      <antd.Button
        type="primary"
        shape="circle"
        icon={<CloseOutlined />}
        onClick={() => handleClose(key)}
      ></antd.Button>
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
  margin: 11px;
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
