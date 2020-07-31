import { gql } from "@apollo/client";

import { RESTAURANT_INFO_FRAGMENT } from "./fragments";

export const ADMIN_CREATE_RESTAURANT = gql`
  mutation AdminCreateRestaurant($input: AdminRestaurantInput!) {
    adminCreateRestaurant(input: $input) {
      ...RestaurantInfo
    }
  }
  ${RESTAURANT_INFO_FRAGMENT}
`;

export const ADMIN_EDIT_RESTAURANT = gql`
  mutation AdminEditRestaurant($input: AdminRestaurantInput!) {
    adminEditRestaurant(input: $input) {
      ...RestaurantInfo
    }
  }
  ${RESTAURANT_INFO_FRAGMENT}
`;
