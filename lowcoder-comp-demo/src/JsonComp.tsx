import {
  antd,
  UICompBuilder,
  jsonValueExposingStateControl,
  toJSONObjectArray,
  jsonControl,
  Section,
  withExposingConfigs,
  NameConfig,
  eventHandlerControl,
  withMethodExposing,
} from "lowcoder-sdk";

import styles from "./styles.module.css";
import { i18nObjs } from "./i18n/comps";

const childrenMap = {
  data: jsonControl(toJSONObjectArray, i18nObjs.defaultData),
  onEvent: eventHandlerControl([
    {
      label: "onChange",
      value: "change",
      description: "",
    },
  ]),
};

const JsonComp = new UICompBuilder(childrenMap, (props: any) => {
  return (
    <div className={styles.wrapper}>
      <span style={{ padding: "0 8px" }}>{props}</span>
    </div>
  );
}).build();

export default withExposingConfigs(JsonComp, [new NameConfig("data", "")]);
