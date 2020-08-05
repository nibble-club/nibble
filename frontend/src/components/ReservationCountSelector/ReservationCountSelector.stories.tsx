import React from "react";

import { action } from "@storybook/addon-actions";
import { number, withKnobs } from "@storybook/addon-knobs";

import ReservationCountSelector from "./ReservationCountSelector";

export default {
  component: ReservationCountSelector,
  title: "ReservationCountSelector",
  excludeStories: /.*Props$/,
  decorators: [withKnobs],
};

export const ImageUpload = () => (
  <ReservationCountSelector
    currentCount={number("Current selected count", 2)}
    availableCount={number("Remaining count", 5)}
    onCountChange={action("count-changed")}
  />
);
