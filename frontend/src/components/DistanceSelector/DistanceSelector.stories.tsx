import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import DistanceSelector from "./DistanceSelector";
import { DistanceSelectorProps } from "./DistanceSelector.types";

export default {
  component: DistanceSelector,
  title: "Input/DistanceSelector",
  excludeStories: /.*Props$/,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onDistanceChange: { action: "distance-changed", table: { disable: true } },
  },
} as Meta;

export const Selector: Story<DistanceSelectorProps> = (args) => (
  <DistanceSelector {...args} />
);
Selector.args = {
  min: 1,
  max: 3,
  startValue: 2,
};
