import { gql } from "@apollo/client";

import { NIBBLE_AVAILABLE_INFO_FRAGMENT, RESTAURANT_INFO_FRAGMENT } from "./fragments";

export const CLOSEST_RESTAURANTS = gql`
  query ClosestRestaurants(
    $location: LatLonInput!
    $paginationInput: PaginationInput!
    $maxDistance: Float!
  ) {
    closestRestaurants(
      location: $location
      paginationInput: $paginationInput
      maxDistance: $maxDistance
    ) {
      totalResults
      restaurants {
        distance(currentPos: $location)
        ...RestaurantInfo
      }
    }
  }
  ${RESTAURANT_INFO_FRAGMENT}
`;

export const GEOCODE_ADDRESS = gql`
  query GeocodeAddress($addr: AddressWithoutLocationInput!) {
    geocodeAddress(address: $addr) {
      latitude
      longitude
    }
  }
`;

export const IMAGE_UPLOAD_URL = gql`
  query ImageUploadUrl($dest: S3ObjectDestination!) {
    imageUploadURL(destination: $dest) {
      presignedUrl
      destination {
        bucket
        region
        key
      }
    }
  }
`;

export const NIBBLE_INFO = gql`
  query NibbleInfo($nibbleId: ID!) {
    nibbleInfo(nibbleId: $nibbleId) {
      ...NibbleAvailableInfo
    }
  }
  ${NIBBLE_AVAILABLE_INFO_FRAGMENT}
`;

export const RESTAURANT_FOR_ADMIN = gql`
  query RestaurantForAdmin {
    restaurantForAdmin {
      ...RestaurantInfo
      nibblesAvailable {
        ...NibbleAvailableInfo
      }
    }
  }
  ${RESTAURANT_INFO_FRAGMENT}
  ${NIBBLE_AVAILABLE_INFO_FRAGMENT}
`;

export const SEARCH = gql`
  query NibbleSearch(
    $user: UserCurrentContextInput!
    $searchParameters: SearchParametersInput!
    $currentPos: LatLonInput!
  ) {
    search(user: $user, searchParameters: $searchParameters) {
      nibbles {
        id
        name
        type
        count
        price
        restaurant {
          name
        }
        availableFrom
        availableTo
      }
      restaurants {
        id
        name
        distance(currentPos: $currentPos)
        logoUrl {
          region
          bucket
          key
        }
      }
    }
  }
`;

export const USER_INFO = gql`
  query UserInfo {
    userInfo {
      fullName
      profilePicUrl {
        bucket
        region
        key
      }
      email
      postalCode
      nibblesReserved {
        id
        name
        count
        price
      }
    }
  }
`;
