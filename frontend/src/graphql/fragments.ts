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
    type
    description
    price
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
    restaurant {
      id
      name
    }
  }
`;

export const NIBBLE_RESTAURANT_INFO_FRAGMENT = gql`
  fragment NibbleRestaurantInfo on NibbleAvailable {
    restaurant {
      id
      name
      logoUrl {
        bucket
        region
        key
      }
      address {
        location {
          latitude
          longitude
        }
      }
    }
  }
`;

export const NIBBLE_RESTAURANT_INFO_WITH_DISTANCE_FRAGMENT = gql`
  fragment NibbleRestaurantInfoWithDistance on NibbleAvailable {
    restaurant {
      id
      name
      logoUrl {
        bucket
        region
        key
      }
      address {
        location {
          latitude
          longitude
        }
      }
      distance(currentPos: $userLocation)
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
