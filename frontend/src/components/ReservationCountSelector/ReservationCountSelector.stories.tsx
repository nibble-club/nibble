import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import ReservationCountSelector from "./ReservationCountSelector";
import { ReservationCountSelectorProps } from "./ReservationCountSelector.types";

export default {
  component: ReservationCountSelector,
  title: "Input/ReservationCountSelector",
  excludeStories: /.*Props$/,
  args: {
    currentCount: 2,
    availableCount: 5,
  },
  argTypes: {
    onCountChange: { action: "count-changed", table: { disable: true } },
  },
} as Meta;

export const Selector: Story<ReservationCountSelectorProps> = (args) => (
  <ReservationCountSelector {...args} />
);
