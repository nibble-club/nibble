import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import MapView from "./MapView";
import { MapViewProps } from "./MapView.types";

export default {
  component: MapView,
  title: "Utilities/MapView",
  excludeStories: /.*Props$/,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    activePin: 0,
  },
  argTypes: {
    activePin: {
      control: "range",
      min: 0,
      max: 3,
    },
  },
} as Meta;

const Template: Story<MapViewProps> = (args) => <MapView {...args} />;

export const BlankMap = Template.bind({});
BlankMap.args = {
  pins: [],
};

export const MapWithPins = Template.bind({});
MapWithPins.args = {
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
