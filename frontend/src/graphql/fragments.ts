import { gql } from "@apollo/client";

export const NIBBLE_AVAILABLE_INFO_FRAGMENT = gql`
  fragment NibbleAvailableInfo on NibbleAvailable {
    id
    name
    restaurant {
      name
      distance(currentPos: $currentPos)
    }
    type
    count
    availableFrom
    availableTo
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
