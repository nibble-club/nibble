import React from "react";

import { NibbleAvailableInfoFragment, NibbleType } from "../../graphql/generated/types";
import { NibbleCardAvailable } from "./NibbleCardAvailable";

export default {
  component: NibbleCardAvailable,
  title: "Nibble Card - Available",
  excludeStories: /.*Props$/,
};

export const symphonySushiProps: NibbleAvailableInfoFragment & {
  restaurantName: string;
  restaurantDistance?: number;
} = {
  id: "3",
  restaurantName: "Symphony Sushi",
  restaurantDistance: 0.2,
  name: "Half sushi roll",
  type: NibbleType.Prepared,
  count: 5,
  imageUrl: {
    bucket: "PLACEHOLDER",
    region: "",
    key: "hero",
  },
  availableFrom: 1595647341,
  availableTo: 1595657341,
  price: 300,
};

export const cheesesteakPlaceProps: NibbleAvailableInfoFragment & {
  restaurantName: string;
  restaurantDistance?: number;
} = {
  id: "4",
  restaurantName: "Cheesesteak Place",
  restaurantDistance: 1.2,
  name: "2 Hoagie rolls",
  type: NibbleType.Ingredients,
  count: 1,
  imageUrl: {
    bucket: "PLACEHOLDER",
    region: "",
    key: "hero",
  },
  availableFrom: 1595647341,
  availableTo: 1595657341,
  price: 300,
};

export const SymphonySushi = () => <NibbleCardAvailable {...symphonySushiProps} />;

export const CheesesteakPlace = () => (
  <NibbleCardAvailable {...cheesesteakPlaceProps} />
);
