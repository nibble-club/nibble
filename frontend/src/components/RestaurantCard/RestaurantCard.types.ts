import { Restaurant, RestaurantInfoFragment } from "../../graphql/generated/types";

export type RestaurantCardProps = Pick<Restaurant, "distance"> & RestaurantInfoFragment;
