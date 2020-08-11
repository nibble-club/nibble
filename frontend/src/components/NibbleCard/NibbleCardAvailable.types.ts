import {
  NibbleAvailableInfoFragment,
  NibbleRestaurantInfoFragment
} from "../../graphql/generated/types";

export type NibbleCardAvailableProps = NibbleAvailableInfoFragment &
  NibbleRestaurantInfoFragment & { restaurant: { distance?: number } };
