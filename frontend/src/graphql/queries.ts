import { gql } from "@apollo/client";

import {
  NIBBLE_AVAILABLE_INFO_FRAGMENT,
  NIBBLE_RESERVED_INFO_FRAGMENT,
  NIBBLE_RESTAURANT_INFO_FRAGMENT,
  NIBBLE_RESTAURANT_INFO_WITH_DISTANCE_FRAGMENT,
  RESTAURANT_INFO_FRAGMENT
} from "./fragments";

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

export const LOCATION_FOR_POSTAL_CODE = gql`
  query LocationForPostalCode($postalCode: String!) {
    locationForPostalCode(postalCode: $postalCode) {
      latitude
      longitude
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

export const NIBBLE_INFO_WITH_RESTAURANT = gql`
  query NibbleInfoWithRestaurant($nibbleId: ID!) {
    nibbleInfo(nibbleId: $nibbleId) {
      ...NibbleAvailableInfo
      ...NibbleRestaurantInfo
    }
  }
  ${NIBBLE_AVAILABLE_INFO_FRAGMENT}
  ${NIBBLE_RESTAURANT_INFO_FRAGMENT}
`;

export const NIBBLES_WITH_PROPERTY_DISTANCE = gql`
  query NibblesWithPropertyDistance(
    $userLocation: LatLonInput!
    $property: NibbleRecommendationReason!
  ) {
    nibblesWithProperty(userLocation: $userLocation, property: $property) {
      ...NibbleAvailableInfo
      ...NibbleRestaurantInfoWithDistance
    }
  }
  ${NIBBLE_AVAILABLE_INFO_FRAGMENT}
  ${NIBBLE_RESTAURANT_INFO_WITH_DISTANCE_FRAGMENT}
`;

export const RESTAURANT_DISTANCE = gql`
  query RestaurantDistance($restaurantId: ID!, $currentPos: LatLonInput!) {
    restaurantInfo(restaurantId: $restaurantId) {
      distance(currentPos: $currentPos)
    }
  }
`;

export const RESTAURANT_FOR_ADMIN = gql`
  query RestaurantForAdmin {
    restaurantForAdmin {
      ...RestaurantInfo
      nibblesAvailable {
        ...NibbleAvailableInfo
        ...NibbleRestaurantInfo
      }
    }
  }
  ${RESTAURANT_INFO_FRAGMENT}
  ${NIBBLE_AVAILABLE_INFO_FRAGMENT}
  ${NIBBLE_RESTAURANT_INFO_FRAGMENT}
`;

export const SEARCH = gql`
  query NibbleSearch(
    $searchParameters: SearchParametersInput!
    $userLocation: LatLonInput!
  ) {
    search(searchParameters: $searchParameters, userLocation: $userLocation) {
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
        distance(currentPos: $userLocation)
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
        ...NibbleReservedInfo
      }
    }
  }
  ${NIBBLE_RESERVED_INFO_FRAGMENT}
`;
