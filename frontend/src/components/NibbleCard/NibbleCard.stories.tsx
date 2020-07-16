import React from "react";

import NibbleCard from "./NibbleCard";
import { NibbleCardProps } from "./NibbleCard.types";

export default {
  component: NibbleCard,
  title: "NibbleCard",
  excludeStories: /.*Props$/,
};

export const symphonySushiProps: NibbleCardProps = {
  restaurant: {
    name: "Symphony Sushi",
    distance: 0.2,
  },
  key: 1,
  name: "Half sushi roll",
  type: "Prepared",
  count: 5,
  imageUrl:
    "https://lh3.googleusercontent.com/d/1PhQuDOXzQDLH1WRmgyLxAv90IoIy7u6s=w265-h177-n?authuser=0",
  loading: false,
};

export const symphonySushiPickupProps: NibbleCardProps = {
  ...symphonySushiProps,
  pickupTime: "9:00 pm",
  count: 2,
};

export const loadingProps: NibbleCardProps = {
  loading: true,
};

export const cheesesteakPlaceProps: NibbleCardProps = {
  restaurant: {
    name: "Cheesesteak Place",
    distance: 1.2,
  },
  key: 1,
  name: "2 Hoagie rolls",
  type: "Ingredients",
  count: 1,
  imageUrl:
    "https://lh3.googleusercontent.com/d/1uf3pUT-bk87u6jrpbEVWj5tPKYgThKPY=w265-h176-n?authuser=0",
  loading: false,
};

export const SymphonySushi = () => <NibbleCard {...symphonySushiProps} />;

export const SymphonySushiPickup = () => (
  <NibbleCard {...symphonySushiPickupProps} />
);

export const CheesesteakPlace = () => <NibbleCard {...cheesesteakPlaceProps} />;

export const Loading = () => <NibbleCard {...loadingProps} />;
