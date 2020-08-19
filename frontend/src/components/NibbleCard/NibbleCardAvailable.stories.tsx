import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import { NibbleType } from "../../graphql/generated/types";
import { NibbleCardAvailable } from "./NibbleCardAvailable";
import { NibbleCardAvailableProps } from "./NibbleCardAvailable.types";

export default {
  component: NibbleCardAvailable,
  title: "Nibbles/NibbleCardAvailable",
  excludeStories: /.*Props$/,
  args: {
    id: "3",
    restaurant: {
      name: "Symphony Sushi",
      address: {
        location: {
          latitude: 42,
          longitude: -71,
        },
      },
      id: "23",
      logoUrl: {
        bucket: "PLACEHOLDER",
        region: "",
        key: "logo",
      },
      distance: 0.2,
    },
    availableFrom: 1595647341,
    availableTo: 1595657341,
  },
  argTypes: {
    availableFrom: {
      control: null,
    },
    availableTo: {
      control: null,
    },
  },
} as Meta;

const Template: Story<NibbleCardAvailableProps> = (args) => (
  <NibbleCardAvailable {...args} />
);

export const Sushi = Template.bind({});
Sushi.args = {
  name: "Half sushi roll",
  type: NibbleType.Prepared,
  count: 5,
  imageUrl: {
    bucket: "800344761765-dev-adchurch-nibble-images",
    region: "us-west-2",
    key: "seeding/sushi.jpg",
  },
  price: 300,
};

export const RiceAndBeans = Template.bind({});
RiceAndBeans.args = {
  // @ts-ignore
  restaurant: {
    id: "5",
    name: "Bolo Burrito",
    distance: 1.2,
  },
  name: "Rice & Beans",
  type: NibbleType.Ingredients,
  count: 1,
  imageUrl: {
    bucket: "800344761765-dev-adchurch-nibble-images",
    region: "us-west-2",
    key: "seeding/rice-beans.jpg",
  },
  price: 100,
};
