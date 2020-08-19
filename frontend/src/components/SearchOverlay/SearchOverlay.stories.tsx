import React, { useRef, useState } from "react";

import { withKnobs } from "@storybook/addon-knobs";
import { Meta, Story } from "@storybook/react/types-6-0";

import { SearchOverlayWithoutConnect } from "./SearchOverlay";
import { SearchOverlayProps } from "./SearchOverlay.types";

export default {
  component: SearchOverlayWithoutConnect,
  title: "Header/SearchOverlay",
  excludeStories: /.*Props$/,
  decorators: [withKnobs],
  parameters: {
    knobs: {
      escapeHTML: false,
    },
  },
  argTypes: {
    headerRef: { table: { disable: true } },
    maxDistance: { table: { disable: true } },
    setMaxDistance: { table: { disable: true } },
    pickupAfter: { table: { disable: true } },
    setPickupAfter: { table: { disable: true } },
  },
} as Meta;

export const Overlay: Story<SearchOverlayProps> = (args) => {
  const ref = useRef(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [pickupAfter, setPickupAfter] = useState<moment.Moment | null>(null);
  return (
    <SearchOverlayWithoutConnect
      {...args}
      headerRef={ref}
      maxDistance={maxDistance}
      setMaxDistance={setMaxDistance}
      pickupAfter={pickupAfter}
      setPickupAfter={setPickupAfter}
    />
  );
};
Overlay.args = {
  show: true,
};
