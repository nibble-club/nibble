import { gql } from "@apollo/client";

export const NIBBLE_AVAILABLE_INFO_FRAGMENT = gql`
  fragment NibbleAvailableInfo on NibbleAvailable {
    id
    name
    type
    count
    price
    availableFrom
    availableTo
    description
    imageUrl {
      bucket
      region
      key
    }
  }
`;

export const NIBBLE_RESERVED_INFO_FRAGMENT = gql`
  fragment NibbleReservedInfo on NibbleReserved {
    id
    name
    restaurant {
      name
    }
    type
    count
    availableFrom
    availableTo
    status
    cancelledAt
    cancellationReason
    reservedAt
    imageUrl {
      bucket
      region
      key
    }
  }
`;

export const RESTAURANT_INFO_FRAGMENT = gql`
  fragment RestaurantInfo on Restaurant {
    id
    name
    market
    description
    disclaimer
    active
    address {
      streetAddress
      dependentLocality
      locality
      administrativeArea
      country
      postalCode
      location {
        latitude
        longitude
      }
    }
    logoUrl {
      bucket
      region
      key
    }
    heroUrl {
      bucket
      key
      region
    }
  }
`;
