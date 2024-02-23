import {
  UICompBuilder,
  NameConfig,
  CommonNameConfig,
  SelectStyle,
  withExposingConfigs,
  styleControl,
  stringExposingStateControl,
  baseSelectRefMethods,
  SelectChildrenMap,
  SelectPropertyView,
  SelectUIView,
  SelectInputCommonConfig,
  SelectInputInvalidConfig,
  useSelectInputValidate,
  RecordConstructorToView,
} from "lowcoder-sdk";

import { trans } from "./i18n/comps";

import { useRef } from "react";

const SelectBasicComp = (function () {
  const childrenMap = {
    ...SelectChildrenMap,
    value: stringExposingStateControl("value"),
    style: styleControl(SelectStyle),
  };
  return new UICompBuilder(childrenMap, (props, dispatch) => {
    const [validateState, handleValidate] = useSelectInputValidate(props);

    const propsRef = useRef<RecordConstructorToView<typeof childrenMap>>(props);
    propsRef.current = props;

    const valueSet = new Set<any>(props.options.map((o) => o.value)); // Filter illegal default values entered by the user
    return props.label({
      required: props.required,
      style: props.style,
      children: (
        <SelectUIView
          {...props}
          value={
            valueSet.has(props.value.value) ? props.value.value : undefined
          }
          onChange={(value) => {
            props.value.onChange(value ?? "").then(() => {
              propsRef.current.onEvent("change");
              handleValidate(value ?? "");
            });
          }}
          dispatch={dispatch}
        />
      ),
      ...validateState,
    });
  })
    .setPropertyViewFn((children) => <SelectPropertyView {...children} />)
    .setExposeMethodConfigs(baseSelectRefMethods)
    .build();
})();

export default withExposingConfigs(SelectBasicComp, [
  new NameConfig("value", trans("selectInput.valueDesc")),
  new NameConfig("inputValue", trans("select.inputValueDesc")),
  SelectInputInvalidConfig,
  ...SelectInputCommonConfig,
  ...CommonNameConfig,
]);
