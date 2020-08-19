import {
  IMAGE_UPLOAD_URL,
  RESTAURANT_FOR_ADMIN,
  GEOCODE_ADDRESS,
  NIBBLE_INFO_WITH_RESTAURANT,
  USER_INFO,
  RECENT_SEARCHES,
} from "../src/graphql/queries";
import { S3ObjectDestination } from "../src/graphql/generated/types";

export const mocks = [
  {
    request: {
      query: NIBBLE_INFO_WITH_RESTAURANT,
      variables: { nibbleId: "123" },
    },
    result: {
      data: {
        nibbleInfo: {
          __typename: "NibbleAvailable",
          restaurant: {
            __typename: "Restaurant",
            name: "Meadhall",
            address: {
              __typename: "Address",
              location: {
                __typename: "LatLon",
                latitude: 42.3637177,
                longitude: -71.087353,
              },
            },
          },
          id: "123",
          name: "Sushi ingredients",
          type: "Ingredients",
          count: 2,
          price: 499,
          availableFrom: 1596773346,
          availableTo: 1596802146,
          description:
            "Ingredients to roll your own sushi - rice, cucumber, avocado, seaweed, and some assortment of proteins",
          imageUrl: {
            __typename: "S3Object",
            bucket: "800344761765-dev-adchurch-nibble-images",
            region: "us-west-2",
            key: "seeding/sushi.jpg",
          },
        },
      },
    },
  },
  {
    request: {
      query: IMAGE_UPLOAD_URL,
      variables: {
        dest: S3ObjectDestination.UserProfilePictures,
      },
    },
    result: {
      data: {
        imageUploadURL: {
          presignedUrl:
            "https://800344761765-dev-adchurch-profile-pics.s3.amazonaws.com/eabb01bd-46be-4b06-a9b1-44a80c9960ff",
          destination: {
            bucket: "800344761765-dev-adchurch-profile-pics",
            region: "us-west-2",
            key: "eabb01bd-46be-4b06-a9b1-44a80c9960ff",
          },
        },
      },
    },
  },
  {
    request: {
      query: IMAGE_UPLOAD_URL,
      variables: {
        dest: S3ObjectDestination.RestaurantHeros,
      },
    },
    result: {
      data: {
        imageUploadURL: {
          presignedUrl:
            "https://800344761765-dev-adchurch-restaurant-heros.s3.amazonaws.com/eabb01bd-46be-4b06-a9b1-44a80c9960ff",
          destination: {
            bucket: "800344761765-dev-adchurch-restaurant-heros",
            region: "us-west-2",
            key: "eabb01bd-46be-4b06-a9b1-44a80c9960ff",
          },
        },
      },
    },
  },
  {
    request: {
      query: IMAGE_UPLOAD_URL,
      variables: {
        dest: S3ObjectDestination.RestaurantLogos,
      },
    },
    result: {
      data: {
        imageUploadURL: {
          presignedUrl:
            "https://800344761765-dev-adchurch-restaurant-logos.s3.amazonaws.com/eabb01bd-46be-4b06-a9b1-44a80c9960ff",
          destination: {
            bucket: "800344761765-dev-adchurch-restaurant-logos",
            region: "us-west-2",
            key: "eabb01bd-46be-4b06-a9b1-44a80c9960ff",
          },
        },
      },
    },
  },
  {
    request: {
      query: IMAGE_UPLOAD_URL,
      variables: {
        dest: S3ObjectDestination.NibbleImages,
      },
    },
    result: {
      data: {
        imageUploadURL: {
          presignedUrl:
            "https://800344761765-dev-adchurch-nibble-images.s3.amazonaws.com/eabb01bd-46be-4b06-a9b1-44a80c9960ff",
          destination: {
            bucket: "800344761765-dev-adchurch-nibble-images",
            region: "us-west-2",
            key: "eabb01bd-46be-4b06-a9b1-44a80c9960ff",
          },
        },
      },
    },
  },
  {
    request: {
      query: RESTAURANT_FOR_ADMIN,
    },
    result: {
      data: {
        restaurantForAdmin: {
          id: "1",
          name: "Symphony Sushi",
          market: "Boston",
          description:
            "Cheery, lively sushi & teriyaki house popular with symphony-goers & students alike.",
          disclaimer: "COVID-19 may affect normal operating hours",
          active: true,
          address: {
            streetAddress: "45 Gainsborough Street",
            dependentLocality: null,
            locality: "Boston",
            administrativeArea: "Massachusetts",
            country: "USA",
            postalCode: "02115",
            location: {
              latitude: 42.34199,
              longitude: -71.087081,
              __typename: "LatLon",
            },
            __typename: "Address",
          },
          logoUrl: {
            bucket: "800344761765-dev-adchurch-restaurant-logos",
            region: "us-west-2",
            key: "8e48585e-c5c3-49c7-ad70-88fe386b4108.jpg",
            __typename: "S3Object",
          },
          heroUrl: {
            bucket: "800344761765-dev-adchurch-restaurant-heros",
            key: "5a791038-01ea-4454-a480-b37a83f2d2fe.jpg",
            region: "us-west-2",
            __typename: "S3Object",
          },
          __typename: "Restaurant",
        },
      },
    },
  },
  {
    request: {
      query: GEOCODE_ADDRESS,
      variables: {
        addr: {
          streetAddress: "45 Gainsborough Street",
          locality: "Boston",
          administrativeArea: "Massachusetts",
          country: "USA",
          postalCode: "02115",
        },
      },
    },
    result: {
      data: {
        geocodeAddress: {
          latitude: 42.34299,
          longitude: -71.088081,
        },
      },
    },
  },
  {
    request: {
      query: USER_INFO,
    },
    result: {
      data: {
        userInfo: {
          email: "chu.andrew.8+u2@outlook.com",
          fullName: "Andrew Day Churchill",
          id: "f827c48d-2c22-4f9e-ad09-144e66516dd5",
          phoneNumber: "6179550053",
          postalCode: "02145",
        },
      },
    },
  },
  {
    request: {
      query: RECENT_SEARCHES,
    },
    result: {
      data: {
        recentSearches: [
          {
            __typename: "SearchParameters",
            text: "grilled cheese",
            maxDistance: null,
            pickupAfter: null,
          },
          {
            __typename: "SearchParameters",
            text: "grilled cheese",
            maxDistance: null,
            pickupAfter: null,
          },
          {
            __typename: "SearchParameters",
            text: "grilled cheese",
            maxDistance: null,
            pickupAfter: null,
          },
          {
            __typename: "SearchParameters",
            text: "grilled cheese",
            maxDistance: null,
            pickupAfter: null,
          },
          {
            __typename: "SearchParameters",
            text: "grilled cheese",
            maxDistance: null,
            pickupAfter: null,
          },
          {
            __typename: "SearchParameters",
            text: "sushi",
            maxDistance: 1.6,
            pickupAfter: null,
          },
          {
            __typename: "SearchParameters",
            text: "sushi",
            maxDistance: 1.6,
            pickupAfter: 1597806000,
          },
        ],
      },
    },
  },
];
