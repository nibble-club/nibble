import {
  NibbleAvailableInfoFragment,
  NibbleRestaurantInfoFragment,
  NibbleRestaurantInfoWithDistanceFragment
} from "../../graphql/generated/types";

export type NibbleCardAvailableProps =
  | (NibbleAvailableInfoFragment & NibbleRestaurantInfoFragment)
  | (NibbleAvailableInfoFragment & NibbleRestaurantInfoWithDistanceFragment);
