import React, { useRef, useState } from "react";

import { withKnobs } from "@storybook/addon-knobs";

import { SearchOverlayWithoutConnect } from "./SearchOverlay";

export default {
  component: SearchOverlayWithoutConnect,
  title: "SearchOverlay",
  excludeStories: /.*Props$/,
  decorators: [withKnobs],
  parameters: {
    knobs: {
      escapeHTML: false,
    },
  },
};

export const Overlay = () => {
  const ref = useRef(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [pickupAfter, setPickupAfter] = useState<moment.Moment | null>(null);
  return (
    <SearchOverlayWithoutConnect
      show
      headerRef={ref}
      maxDistance={maxDistance}
      setMaxDistance={setMaxDistance}
      pickupAfter={pickupAfter}
      setPickupAfter={setPickupAfter}
    />
  );
};
