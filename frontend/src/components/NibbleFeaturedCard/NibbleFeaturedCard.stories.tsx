import React from "react";

import { number, withKnobs } from "@storybook/addon-knobs";

import { NibbleType } from "../../graphql/generated/types";
import { NibbleFeaturedCard } from "./NibbleFeaturedCard";
import { NibbleFeaturedCardProps } from "./NibbleFeaturedCard.types";

export default {
  component: NibbleFeaturedCard,
  title: "NibbleFeaturedCard",
  excludeStories: /.*Props$/,
  decorators: [withKnobs],
};

export const symphonySushiProps: NibbleFeaturedCardProps = {
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

export const cheesesteakPlaceProps: NibbleFeaturedCardProps = {
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

export const SymphonySushi = () => (
  <NibbleFeaturedCard {...symphonySushiProps} count={number("Available count", 5)} />
);

export const CheesesteakPlace = () => (
  <NibbleFeaturedCard {...cheesesteakPlaceProps} count={number("Available count", 1)} />
);
