import React from "react";

import { NibbleAvailableInfoFragment, NibbleType } from "../../graphql/generated/types";
import { NibbleCardAvailable } from "./NibbleCardAvailable";
import { NibbleCardAvailableProps } from "./NibbleCardAvailable.types";

export default {
  component: NibbleCardAvailable,
  title: "NibbleCardAvailable",
  excludeStories: /.*Props$/,
};

export const symphonySushiProps: NibbleCardAvailableProps = {
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

export const cheesesteakPlaceProps: NibbleCardAvailableProps = {
  id: "4",
  restaurant: {
    name: "Cheesesteak Place",
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
    distance: 1.2,
  },
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
