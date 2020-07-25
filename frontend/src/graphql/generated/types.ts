export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSTimestamp: number;
};

export type Address = {
  __typename?: "Address";
  streetAddress: Scalars["String"];
  dependentLocality?: Maybe<Scalars["String"]>;
  locality: Scalars["String"];
  administrativeArea: Scalars["String"];
  country: Scalars["String"];
  postalCode: Scalars["String"];
  location: LatLon;
};

export type AddressInput = {
  streetAddress: Scalars["String"];
  dependentLocality?: Maybe<Scalars["String"]>;
  locality: Scalars["String"];
  administrativeArea: Scalars["String"];
  country: Scalars["String"];
  postalCode: Scalars["String"];
  location: LatLonInput;
};

export type AdminDeleteNibbleResponse = {
  __typename?: "AdminDeleteNibbleResponse";
  id: Scalars["ID"];
};

export type AdminEditNibbleInput = {
  name: Scalars["String"];
  type?: Maybe<NibbleType>;
  count: Scalars["Int"];
  imageUrl: S3ObjectInput;
  description?: Maybe<Scalars["String"]>;
  price: Scalars["Int"];
  availableFrom: Scalars["AWSTimestamp"];
  availableTo: Scalars["AWSTimestamp"];
};

export type AdminNibbleInput = {
  name: Scalars["String"];
  type?: Maybe<NibbleType>;
  count: Scalars["Int"];
  imageUrl: S3ObjectInput;
  restaurantId: Scalars["ID"];
  description?: Maybe<Scalars["String"]>;
  price: Scalars["Int"];
  availableFrom: Scalars["AWSTimestamp"];
  availableTo: Scalars["AWSTimestamp"];
};

export type AdminRestaurantInput = {
  name: Scalars["String"];
  address: AddressInput;
  market: Scalars["String"];
  description: Scalars["String"];
  logoUrl: S3ObjectInput;
  heroUrl: S3ObjectInput;
  disclaimer?: Maybe<Scalars["String"]>;
  active: Scalars["Boolean"];
};

export type LatLon = {
  __typename?: "LatLon";
  latitude: Scalars["Float"];
  longitude: Scalars["Float"];
};

export type LatLonInput = {
  latitude: Scalars["Float"];
  longitude: Scalars["Float"];
};

export type Mutation = {
  __typename?: "Mutation";
  adminCreateRestaurant: Restaurant;
  adminEditRestaurant: Restaurant;
  adminDeactivateRestaurant: Restaurant;
  adminCreateNibble: NibbleAvailable;
  adminEditNibble: NibbleAvailable;
  adminDeleteNibble: AdminDeleteNibbleResponse;
  adminCancelReservation: NibbleCancelReservationResponse;
  nibbleCreateReservation: NibbleReserved;
  nibbleEditReservation: NibbleReserved;
  nibbleCancelReservation: NibbleCancelReservationResponse;
  nibbleCompleteReservation: NibbleReserved;
};

export type MutationAdminCreateRestaurantArgs = {
  input: AdminRestaurantInput;
};

export type MutationAdminEditRestaurantArgs = {
  id: Scalars["ID"];
  input: AdminRestaurantInput;
};

export type MutationAdminDeactivateRestaurantArgs = {
  id: Scalars["ID"];
};

export type MutationAdminCreateNibbleArgs = {
  input: AdminNibbleInput;
};

export type MutationAdminEditNibbleArgs = {
  id: Scalars["ID"];
  input: AdminEditNibbleInput;
};

export type MutationAdminDeleteNibbleArgs = {
  id: Scalars["ID"];
};

export type MutationAdminCancelReservationArgs = {
  userId: Scalars["ID"];
  nibbleId: Scalars["ID"];
  reason?: Maybe<Scalars["String"]>;
};

export type MutationNibbleCreateReservationArgs = {
  userId: Scalars["ID"];
  nibbleId: Scalars["ID"];
  count: Scalars["Int"];
};

export type MutationNibbleEditReservationArgs = {
  userId: Scalars["ID"];
  nibbleId: Scalars["ID"];
  newCount: Scalars["Int"];
};

export type MutationNibbleCancelReservationArgs = {
  userId: Scalars["ID"];
  nibbleId: Scalars["ID"];
  reason?: Maybe<Scalars["String"]>;
};

export type MutationNibbleCompleteReservationArgs = {
  userId: Scalars["ID"];
  nibbleId: Scalars["ID"];
};

export type NibbleAvailable = {
  __typename?: "NibbleAvailable";
  id: Scalars["ID"];
  name: Scalars["String"];
  type: NibbleType;
  count: Scalars["Int"];
  imageUrl: S3Object;
  restaurant: Restaurant;
  description?: Maybe<Scalars["String"]>;
  price: Scalars["Int"];
  availableFrom: Scalars["AWSTimestamp"];
  availableTo: Scalars["AWSTimestamp"];
};

export type NibbleCancelReservationResponse = {
  __typename?: "NibbleCancelReservationResponse";
  oldPrice: Scalars["Int"];
};

export enum NibbleRecommendationReason {
  Distance = "Distance",
  AvailableNow = "AvailableNow",
}

export enum NibbleReservationStatus {
  Reserved = "Reserved",
  CancelledByUser = "CancelledByUser",
  CancelledByRestaurant = "CancelledByRestaurant",
  Completed = "Completed",
}

export type NibbleReserved = {
  __typename?: "NibbleReserved";
  id: Scalars["ID"];
  name: Scalars["String"];
  type: NibbleType;
  count: Scalars["Int"];
  imageUrl: S3Object;
  restaurant: Restaurant;
  description?: Maybe<Scalars["String"]>;
  price: Scalars["Int"];
  availableFrom: Scalars["AWSTimestamp"];
  availableTo: Scalars["AWSTimestamp"];
  status: NibbleReservationStatus;
  cancelledAt?: Maybe<Scalars["AWSTimestamp"]>;
  cancellationReason?: Maybe<Scalars["String"]>;
  reservedAt: Scalars["AWSTimestamp"];
};

export enum NibbleType {
  Prepared = "Prepared",
  Ingredients = "Ingredients",
  Mystery = "Mystery",
}

export type PaginationInput = {
  offset?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
};

export type Query = {
  __typename?: "Query";
  userInfo: User;
  nibblesFeatured: Array<Maybe<NibbleAvailable>>;
  nibbleInfo: NibbleAvailable;
  nibblesRecommended: Array<Maybe<NibbleAvailable>>;
  nibblesWithProperty: Array<Maybe<NibbleAvailable>>;
  closestRestaurants: Array<Maybe<Restaurant>>;
  restaurantInfo: Restaurant;
  recentSearch?: Maybe<Array<Maybe<SearchParameters>>>;
  search: SearchResults;
};

export type QueryUserInfoArgs = {
  userId: Scalars["ID"];
};

export type QueryNibblesFeaturedArgs = {
  user: UserCurrentContextInput;
};

export type QueryNibbleInfoArgs = {
  nibbleId: Scalars["ID"];
};

export type QueryNibblesRecommendedArgs = {
  user: UserCurrentContextInput;
};

export type QueryNibblesWithPropertyArgs = {
  user: UserCurrentContextInput;
  property: NibbleRecommendationReason;
};

export type QueryClosestRestaurantsArgs = {
  location: LatLonInput;
  paginationInput: PaginationInput;
};

export type QueryRestaurantInfoArgs = {
  restaurantId: Scalars["ID"];
};

export type QueryRecentSearchArgs = {
  userId: Scalars["ID"];
};

export type QuerySearchArgs = {
  user: UserCurrentContextInput;
  searchParameters: SearchParametersInput;
};

export type Restaurant = {
  __typename?: "Restaurant";
  id: Scalars["ID"];
  name: Scalars["String"];
  market: Scalars["String"];
  address: Address;
  description: Scalars["String"];
  logoUrl: S3Object;
  heroUrl: S3Object;
  disclaimer?: Maybe<Scalars["String"]>;
  distance: Scalars["Float"];
  nibblesAvailable: Array<Maybe<NibbleAvailable>>;
  active: Scalars["Boolean"];
};

export type RestaurantDistanceArgs = {
  currentPos: LatLonInput;
};

export type S3Object = {
  __typename?: "S3Object";
  bucket: Scalars["String"];
  region: Scalars["String"];
  key: Scalars["String"];
};

export type S3ObjectInput = {
  bucket: Scalars["String"];
  region: Scalars["String"];
  key: Scalars["String"];
};

export type SearchParameters = {
  __typename?: "SearchParameters";
  text: Scalars["String"];
};

export type SearchParametersInput = {
  text: Scalars["String"];
  maxDistance?: Maybe<Scalars["Int"]>;
  earliestPickup?: Maybe<Scalars["AWSTimestamp"]>;
  latestPickup?: Maybe<Scalars["AWSTimestamp"]>;
  pagination?: Maybe<PaginationInput>;
};

export type SearchRecentQueries = {
  __typename?: "SearchRecentQueries";
  recentQueries?: Maybe<Array<Maybe<SearchParameters>>>;
};

export type SearchResults = {
  __typename?: "SearchResults";
  nibbles?: Maybe<Array<Maybe<NibbleAvailable>>>;
  restaurants?: Maybe<Array<Maybe<Restaurant>>>;
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  fullName: Scalars["String"];
  profilePicUrl: S3Object;
  email: Scalars["String"];
  phoneNumber?: Maybe<Scalars["String"]>;
  postalCode?: Maybe<Scalars["String"]>;
  nibblesReserved: Array<Maybe<NibbleReserved>>;
  nibblesHistory: Array<Maybe<NibbleReserved>>;
};

export type UserCurrentContextInput = {
  id: Scalars["ID"];
  postalCode: Scalars["String"];
  location?: Maybe<LatLonInput>;
};

export type NibbleAvailableInfoFragment = { __typename?: "NibbleAvailable" } & Pick<
  NibbleAvailable,
  "id" | "name" | "type" | "count" | "availableFrom" | "availableTo"
> & {
    restaurant: { __typename?: "Restaurant" } & Pick<Restaurant, "name" | "distance">;
    imageUrl: { __typename?: "S3Object" } & Pick<S3Object, "bucket" | "region" | "key">;
  };

export type NibbleReservedInfoFragment = { __typename?: "NibbleReserved" } & Pick<
  NibbleReserved,
  | "id"
  | "name"
  | "type"
  | "count"
  | "availableFrom"
  | "availableTo"
  | "status"
  | "cancelledAt"
  | "cancellationReason"
  | "reservedAt"
> & {
    restaurant: { __typename?: "Restaurant" } & Pick<Restaurant, "name">;
    imageUrl: { __typename?: "S3Object" } & Pick<S3Object, "bucket" | "region" | "key">;
  };

export type UserInfoQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type UserInfoQuery = { __typename?: "Query" } & {
  userInfo: { __typename?: "User" } & Pick<
    User,
    "fullName" | "email" | "postalCode"
  > & {
      profilePicUrl: { __typename?: "S3Object" } & Pick<
        S3Object,
        "bucket" | "region" | "key"
      >;
      nibblesReserved: Array<
        Maybe<
          { __typename?: "NibbleReserved" } & Pick<
            NibbleReserved,
            "id" | "name" | "count" | "price"
          >
        >
      >;
    };
};

export type NibbleSearchQueryVariables = Exact<{
  user: UserCurrentContextInput;
  searchParameters: SearchParametersInput;
  currentPos: LatLonInput;
}>;

export type NibbleSearchQuery = { __typename?: "Query" } & {
  search: { __typename?: "SearchResults" } & {
    nibbles?: Maybe<
      Array<
        Maybe<
          { __typename?: "NibbleAvailable" } & Pick<
            NibbleAvailable,
            "id" | "name" | "type" | "count" | "price" | "availableFrom" | "availableTo"
          > & { restaurant: { __typename?: "Restaurant" } & Pick<Restaurant, "name"> }
        >
      >
    >;
    restaurants?: Maybe<
      Array<
        Maybe<
          { __typename?: "Restaurant" } & Pick<
            Restaurant,
            "id" | "name" | "distance"
          > & {
              logoUrl: { __typename?: "S3Object" } & Pick<
                S3Object,
                "region" | "bucket" | "key"
              >;
            }
        >
      >
    >;
  };
};
