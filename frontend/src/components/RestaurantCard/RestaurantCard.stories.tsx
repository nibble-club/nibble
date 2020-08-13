import React from "react";

import RestaurantCard from "./RestaurantCard";
import { RestaurantCardProps } from "./RestaurantCard.types";

export default {
  component: RestaurantCard,
  title: "RestaurantCard",
  excludeStories: /.*Props$/,
};

export const SymphonySushiProps: RestaurantCardProps = {
  id: "1",
  name: "Symphony Sushi",
  market: "Boston",
  description:
    "Cheery, lively sushi & teriyaki house popular with symphony-goers & students alike.",
  disclaimer: "COVID-19 may affect normal operating hours",
  active: true,
  address: {
    streetAddress: "45 Gainsborough Street",
    dependentLocality: null,
    locality: "Boston",
    administrativeArea: "Massachusetts",
    country: "USA",
    postalCode: "02115",
    location: {
      latitude: 42.34199,
      longitude: -71.087081,
      __typename: "LatLon",
    },
    __typename: "Address",
  },
  distance: 1.2,
  logoUrl: {
    bucket: "800344761765-dev-adchurch-restaurant-logos",
    region: "us-west-2",
    key: "8e48585e-c5c3-49c7-ad70-88fe386b4108.jpg",
    __typename: "S3Object",
  },
  heroUrl: {
    bucket: "800344761765-dev-adchurch-restaurant-heros",
    key: "5a791038-01ea-4454-a480-b37a83f2d2fe.jpg",
    region: "us-west-2",
    __typename: "S3Object",
  },
  __typename: "Restaurant",
};

export const SymphonySushi = () => <RestaurantCard {...SymphonySushiProps} />;
