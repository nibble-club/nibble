import React from "react";

import { number, withKnobs } from "@storybook/addon-knobs";

import MapView from "./MapView";
import { MapViewProps } from "./MapView.types";

export default {
  component: MapView,
  title: "MapView",
  excludeStories: /.*Props$/,
  decorators: [withKnobs],
};

export const BlankMapProps: MapViewProps = {
  pins: [],
};

export const MapWithPinsProps: MapViewProps = {
  pins: [
    {
      address: {
        location: {
          latitude: 42.3987892,
          longitude: -71.1263568,
        },
      },
      name: "Dave's Fresh Pasta",
    },
    {
      address: {
        location: {
          latitude: 42.3418024,
          longitude: -71.0868342,
        },
      },
      name: "Symphony Sushi",
    },
    {
      address: {
        location: {
          latitude: 42.395754,
          longitude: -71.081044,
        },
      },
      name: "Legal on the Mystic",
    },
  ],
};

export const BlankMap = () => (
  <div style={{ height: 500 }}>
    <MapView {...BlankMapProps} />
  </div>
);

export const MapWithPins = () => (
  <MapView {...MapWithPinsProps} activePin={number("Active Pin", -1)} />
);
