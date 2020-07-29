import { gql } from "@apollo/client";

export const USER_INFO = gql`
  query userInfo {
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

export const IMAGE_UPLOAD_URL = gql`
  query imageUploadUrl($dest: S3ObjectDestination!) {
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

export const SEARCH = gql`
  query nibbleSearch(
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
