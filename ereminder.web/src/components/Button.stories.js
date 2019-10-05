import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import Button from "./Button";

storiesOf("Button", module)
  .add("default", () => (
    <Button onClick={action("button-clicked")}>Example button</Button>
  ))
  .add("disabled", () => <Button disabled>Disabled button</Button>);
