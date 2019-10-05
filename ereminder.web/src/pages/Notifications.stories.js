import { storiesOf } from "@storybook/react";
import React from "react";
import { NotificationSection } from "./Notifications";

storiesOf("Notifications", module).add("NotificationSection", () => (
  <NotificationSection title="Test" />
));
