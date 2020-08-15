import React from "react";

import { action } from "@storybook/addon-actions";
import { number, withKnobs } from "@storybook/addon-knobs";

import DistanceSelector from "./DistanceSelector";

export default {
  component: DistanceSelector,
  title: "DistanceSelector",
  excludeStories: /.*Props$/,
  decorators: [withKnobs],
  parameters: {
    knobs: {
      escapeHTML: false,
    },
  },
};

export const Selector = () => (
  <DistanceSelector
    max={number("Max Distance", 3)}
    min={number("Min Distance", 1)}
    onDistanceChange={action("distance-changed")}
  />
);
