import {
  LabelControl,
  StringControl,
  BoolCodeControl,
  SelectEventHandlerControl,
  SelectOptionControl,
  BoolControl,
  MarginControl,
  PaddingControl,
  RefControl,
  formDataChildren,
} from "lowcoder-sdk";
import { BaseSelectRef } from "rc-select";
import { SelectInputValidationChildren } from "./selectInputConstants";

export const SelectChildrenMap = {
  label: LabelControl,
  placeholder: StringControl,
  disabled: BoolCodeControl,
  onEvent: SelectEventHandlerControl,
  options: SelectOptionControl,
  allowClear: BoolControl,
  inputValue: stateComp<string>(""), // user's input value when search
  showSearch: BoolControl.DEFAULT_TRUE,
  viewRef: RefControl<BaseSelectRef>,
  margin: MarginControl,
  padding: PaddingControl,
  ...SelectInputValidationChildren,
  ...formDataChildren,
};
