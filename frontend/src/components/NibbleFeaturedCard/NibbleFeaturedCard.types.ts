import { NibbleAvailableInfoFragment } from "../../graphql/generated/types";

export type NibbleFeaturedCardProps = NibbleAvailableInfoFragment & {
  restaurantName: string;
  restaurantDistance?: number;
};
