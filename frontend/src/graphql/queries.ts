import { gql } from "@apollo/client";

import {
  NIBBLE_AVAILABLE_INFO_FRAGMENT,
  NIBBLE_RESERVED_INFO_FRAGMENT,
  NIBBLE_RESTAURANT_INFO_FRAGMENT,
  NIBBLE_RESTAURANT_INFO_WITH_DISTANCE_FRAGMENT,
  RESTAURANT_INFO_FRAGMENT
} from "./fragments";

export const ADMIN_NIBBLE_RESERVATIONS = gql`
  query AdminNibbleReservations($nibbleId: ID!) {
    adminNibbleReservations(nibbleId: $nibbleId) {
      totalAvailable
      reservations {
        nibbleId
        count
        price
        reservedAt
        user {
          userId
          name
          email
          profilePicUrl {
            bucket
            region
            key
          }
        }
        status
        cancelledAt
        cancellationReason
      }
    }
  }
`;

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

export const NIBBLE_RESERVATION = gql`
  query NibbleReservation($nibbleId: ID!) {
    nibbleReservation(nibbleId: $nibbleId) {
      ...NibbleReservedInfo
    }
  }
  ${NIBBLE_RESERVED_INFO_FRAGMENT}
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

export const RECENT_SEARCHES = gql`
  query RecentSearches {
    recentSearches {
      text
      maxDistance
      pickupAfter
    }
  }
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

export const RESTAURANT_INFO = gql`
  query RestaurantInfo($restaurantId: ID!) {
    restaurantInfo(restaurantId: $restaurantId) {
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
  query Search($searchParameters: SearchParametersInput!, $userLocation: LatLonInput!) {
    search(searchParameters: $searchParameters, userLocation: $userLocation) {
      nibbles {
        ...NibbleAvailableInfo
        ...NibbleRestaurantInfoWithDistance
      }
      restaurants {
        ...RestaurantInfo
        distance(currentPos: $userLocation)
      }
    }
  }
  ${RESTAURANT_INFO_FRAGMENT}
  ${NIBBLE_AVAILABLE_INFO_FRAGMENT}
  ${NIBBLE_RESTAURANT_INFO_WITH_DISTANCE_FRAGMENT}
`;

export const USER_INFO = gql`
  query UserInfo {
    userInfo {
      id
      fullName
      profilePicUrl {
        bucket
        region
        key
      }
      email
      phoneNumber
      postalCode
    }
  }
`;

export const USER_INFO_NIBBLES_RESERVED = gql`
  query UserInfoNibblesReserved {
    userInfo {
      id
      fullName
      profilePicUrl {
        bucket
        region
        key
      }
      email
      phoneNumber
      postalCode
      nibblesReserved {
        ...NibbleReservedInfo
      }
    }
  }
  ${NIBBLE_RESERVED_INFO_FRAGMENT}
`;

export const USER_INFO_NIBBLES_HISTORY = gql`
  query UserInfoNibblesHistory {
    userInfo {
      id
      fullName
      profilePicUrl {
        bucket
        region
        key
      }
      email
      phoneNumber
      postalCode
      nibblesHistory {
        ...NibbleReservedInfo
      }
    }
  }
  ${NIBBLE_RESERVED_INFO_FRAGMENT}
`;
