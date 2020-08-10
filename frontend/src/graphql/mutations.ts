import { gql } from "@apollo/client";

import { NIBBLE_AVAILABLE_INFO_FRAGMENT, RESTAURANT_INFO_FRAGMENT } from "./fragments";

export const ADMIN_CREATE_NIBBLE = gql`
  mutation AdminCreateNibble($input: AdminNibbleInput!) {
    adminCreateNibble(input: $input) {
      ...NibbleAvailableInfo
    }
  }
  ${NIBBLE_AVAILABLE_INFO_FRAGMENT}
`;

export const ADMIN_EDIT_NIBBLE = gql`
  mutation AdminEditNibble($id: ID!, $input: AdminNibbleInput!) {
    adminEditNibble(id: $id, input: $input) {
      ...NibbleAvailableInfo
    }
  }
  ${NIBBLE_AVAILABLE_INFO_FRAGMENT}
`;

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

export const NIBBLE_CREATE_RESERVATION = gql`
  mutation NibbleCreateReservation($nibbleId: ID!, $count: Int!) {
    nibbleCreateReservation(nibbleId: $nibbleId, count: $count) {
      id
      name
      type
      count
      imageUrl {
        bucket
        region
        key
      }
      price
      availableFrom
      availableTo
      status
      reservedAt
    }
  }
`;
