import { storiesOf } from "@storybook/react";
import React from "react";
import Button from "./Button";

storiesOf("Button", module).add("default", () => (
  <Button>Example button</Button>
));
