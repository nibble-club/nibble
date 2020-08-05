import React from "react";

import { number, withKnobs } from "@storybook/addon-knobs";

import { NibbleType } from "../../graphql/generated/types";
import NibbleFeaturedCard from "./NibbleFeaturedCard";

export default {
  component: NibbleFeaturedCard,
  title: "NibbleFeaturedCard",
  excludeStories: /.*Props$/,
  decorators: [withKnobs],
};

export const symphonySushiProps = {
  id: "3",
  restaurantName: "Symphony Sushi",
  restaurantDistance: 0.2,
  name: "Half sushi roll",
  type: NibbleType.Prepared,
  imageUrl: {
    bucket: "800344761765-dev-adchurch-nibble-images",
    region: "us-west-2",
    key: "1c541aa7-0222-4899-8ac4-2a1d2db6ac0f.jpg",
  },
  availableFrom: 1595647341,
  availableTo: 1595657341,
  price: 300,
};

export const cheesesteakPlaceProps = {
  id: "4",
  restaurantName: "Cheesesteak Place",
  restaurantDistance: 1.2,
  name: "2 Hoagie rolls",
  type: NibbleType.Ingredients,
  imageUrl: {
    bucket: "800344761765-dev-adchurch-nibble-images",
    region: "us-west-2",
    key: "1c541aa7-0222-4899-8ac4-2a1d2db6ac0f.jpg",
  },
  availableFrom: 1595647341,
  availableTo: 1595657341,
  price: 300,
};

export const SymphonySushi = () => (
  <NibbleFeaturedCard {...symphonySushiProps} count={number("Available count", 5)} />
);

export const CheesesteakPlace = () => (
  <NibbleFeaturedCard {...cheesesteakPlaceProps} count={number("Available count", 1)} />
);
