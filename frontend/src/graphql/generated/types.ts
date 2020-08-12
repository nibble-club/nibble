export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSTimestamp: any;
};

export type Address = {
  __typename?: 'Address';
  streetAddress: Scalars['String'];
  dependentLocality?: Maybe<Scalars['String']>;
  locality: Scalars['String'];
  administrativeArea: Scalars['String'];
  country: Scalars['String'];
  postalCode: Scalars['String'];
  location: LatLon;
};

export type AddressInput = {
  streetAddress: Scalars['String'];
  dependentLocality?: Maybe<Scalars['String']>;
  locality: Scalars['String'];
  administrativeArea: Scalars['String'];
  country: Scalars['String'];
  postalCode: Scalars['String'];
  location: LatLonInput;
};

export type AddressWithoutLocationInput = {
  streetAddress: Scalars['String'];
  dependentLocality?: Maybe<Scalars['String']>;
  locality: Scalars['String'];
  administrativeArea: Scalars['String'];
  country: Scalars['String'];
  postalCode: Scalars['String'];
};

export type AdminDeleteNibbleResponse = {
  __typename?: 'AdminDeleteNibbleResponse';
  id: Scalars['ID'];
};

export type AdminNibbleInput = {
  name: Scalars['String'];
  type: NibbleType;
  count: Scalars['Int'];
  imageUrl: S3ObjectInput;
  description?: Maybe<Scalars['String']>;
  price: Scalars['Int'];
  availableFrom: Scalars['AWSTimestamp'];
  availableTo: Scalars['AWSTimestamp'];
};

export type AdminRestaurantInput = {
  name: Scalars['String'];
  address: AddressInput;
  market: Scalars['String'];
  description: Scalars['String'];
  logoUrl: S3ObjectInput;
  heroUrl: S3ObjectInput;
  disclaimer?: Maybe<Scalars['String']>;
  active: Scalars['Boolean'];
};


export type ClosestRestaurantsResults = {
  __typename?: 'ClosestRestaurantsResults';
  restaurants: Array<Restaurant>;
  totalResults: Scalars['Int'];
};

export type ImageUploadDestination = {
  __typename?: 'ImageUploadDestination';
  presignedUrl: Scalars['String'];
  destination: S3Object;
};

export type LatLon = {
  __typename?: 'LatLon';
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

export type LatLonInput = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
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
  input: AdminRestaurantInput;
};


export type MutationAdminDeactivateRestaurantArgs = {
  id: Scalars['ID'];
};


export type MutationAdminCreateNibbleArgs = {
  input: AdminNibbleInput;
};


export type MutationAdminEditNibbleArgs = {
  id: Scalars['ID'];
  input: AdminNibbleInput;
};


export type MutationAdminDeleteNibbleArgs = {
  id: Scalars['ID'];
};


export type MutationAdminCancelReservationArgs = {
  userId: Scalars['ID'];
  nibbleId: Scalars['ID'];
  reason?: Maybe<Scalars['String']>;
};


export type MutationNibbleCreateReservationArgs = {
  nibbleId: Scalars['ID'];
  count: Scalars['Int'];
};


export type MutationNibbleEditReservationArgs = {
  nibbleId: Scalars['ID'];
  newCount: Scalars['Int'];
};


export type MutationNibbleCancelReservationArgs = {
  nibbleId: Scalars['ID'];
  reason?: Maybe<Scalars['String']>;
};


export type MutationNibbleCompleteReservationArgs = {
  nibbleId: Scalars['ID'];
};

export type NibbleAvailable = {
  __typename?: 'NibbleAvailable';
  id: Scalars['ID'];
  name: Scalars['String'];
  type: NibbleType;
  count: Scalars['Int'];
  imageUrl: S3Object;
  restaurant: Restaurant;
  description?: Maybe<Scalars['String']>;
  price: Scalars['Int'];
  availableFrom: Scalars['AWSTimestamp'];
  availableTo: Scalars['AWSTimestamp'];
};

export type NibbleCancelReservationResponse = {
  __typename?: 'NibbleCancelReservationResponse';
  oldPrice: Scalars['Int'];
};

export enum NibbleRecommendationReason {
  Recommended = 'Recommended',
  Distance = 'Distance',
  AvailableNow = 'AvailableNow'
}

export enum NibbleReservationStatus {
  Reserved = 'Reserved',
  CancelledByUser = 'CancelledByUser',
  CancelledByRestaurant = 'CancelledByRestaurant',
  Completed = 'Completed'
}

export type NibbleReserved = {
  __typename?: 'NibbleReserved';
  id: Scalars['ID'];
  name: Scalars['String'];
  type: NibbleType;
  count: Scalars['Int'];
  imageUrl: S3Object;
  restaurant: Restaurant;
  description?: Maybe<Scalars['String']>;
  price: Scalars['Int'];
  availableFrom: Scalars['AWSTimestamp'];
  availableTo: Scalars['AWSTimestamp'];
  status: NibbleReservationStatus;
  cancelledAt?: Maybe<Scalars['AWSTimestamp']>;
  cancellationReason?: Maybe<Scalars['String']>;
  reservedAt: Scalars['AWSTimestamp'];
};

export enum NibbleType {
  Prepared = 'Prepared',
  Ingredients = 'Ingredients',
  Mystery = 'Mystery'
}

export type PaginationInput = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  userInfo: User;
  nibblesFeatured: Array<NibbleAvailable>;
  nibbleInfo: NibbleAvailable;
  nibblesWithProperty: Array<NibbleAvailable>;
  closestRestaurants: ClosestRestaurantsResults;
  geocodeAddress: LatLon;
  imageUploadURL: ImageUploadDestination;
  locationForPostalCode: LatLon;
  restaurantForAdmin: Restaurant;
  restaurantInfo: Restaurant;
  recentSearches: Array<SearchParameters>;
  search: SearchResults;
};


export type QueryNibblesFeaturedArgs = {
  userLocation: LatLonInput;
};


export type QueryNibbleInfoArgs = {
  nibbleId: Scalars['ID'];
};


export type QueryNibblesWithPropertyArgs = {
  userLocation: LatLonInput;
  property: NibbleRecommendationReason;
};


export type QueryClosestRestaurantsArgs = {
  location: LatLonInput;
  paginationInput: PaginationInput;
  maxDistance: Scalars['Float'];
};


export type QueryGeocodeAddressArgs = {
  address: AddressWithoutLocationInput;
};


export type QueryImageUploadUrlArgs = {
  destination?: Maybe<S3ObjectDestination>;
};


export type QueryLocationForPostalCodeArgs = {
  postalCode: Scalars['String'];
};


export type QueryRestaurantInfoArgs = {
  restaurantId: Scalars['ID'];
};


export type QuerySearchArgs = {
  userLocation: LatLonInput;
  searchParameters: SearchParametersInput;
};

export type Restaurant = {
  __typename?: 'Restaurant';
  id: Scalars['ID'];
  name: Scalars['String'];
  market: Scalars['String'];
  address: Address;
  description: Scalars['String'];
  logoUrl: S3Object;
  heroUrl: S3Object;
  disclaimer?: Maybe<Scalars['String']>;
  distance: Scalars['Float'];
  nibblesAvailable: Array<NibbleAvailable>;
  active: Scalars['Boolean'];
};


export type RestaurantDistanceArgs = {
  currentPos: LatLonInput;
};

export type S3Object = {
  __typename?: 'S3Object';
  bucket: Scalars['String'];
  region: Scalars['String'];
  key: Scalars['String'];
};

export enum S3ObjectDestination {
  UserProfilePictures = 'UserProfilePictures',
  RestaurantLogos = 'RestaurantLogos',
  RestaurantHeros = 'RestaurantHeros',
  NibbleImages = 'NibbleImages'
}

export type S3ObjectInput = {
  bucket: Scalars['String'];
  region: Scalars['String'];
  key: Scalars['String'];
};

export type SearchParameters = {
  __typename?: 'SearchParameters';
  text: Scalars['String'];
  maxDistance?: Maybe<Scalars['Int']>;
  latestPickup?: Maybe<Scalars['AWSTimestamp']>;
};

export type SearchParametersInput = {
  text: Scalars['String'];
  maxDistance?: Maybe<Scalars['Float']>;
  latestPickup?: Maybe<Scalars['AWSTimestamp']>;
};

export type SearchRecentQueries = {
  __typename?: 'SearchRecentQueries';
  recentQueries?: Maybe<Array<Maybe<SearchParameters>>>;
};

export type SearchResults = {
  __typename?: 'SearchResults';
  nibbles: Array<NibbleAvailable>;
  restaurants: Array<Restaurant>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  fullName: Scalars['String'];
  profilePicUrl: S3Object;
  email: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  nibblesReserved: Array<NibbleReserved>;
  nibblesHistory: Array<NibbleReserved>;
};

export type NibbleAvailableInfoFragment = (
  { __typename?: 'NibbleAvailable' }
  & Pick<NibbleAvailable, 'id' | 'name' | 'type' | 'count' | 'price' | 'availableFrom' | 'availableTo' | 'description'>
  & { imageUrl: (
    { __typename?: 'S3Object' }
    & Pick<S3Object, 'bucket' | 'region' | 'key'>
  ) }
);

export type NibbleReservedInfoFragment = (
  { __typename?: 'NibbleReserved' }
  & Pick<NibbleReserved, 'id' | 'name' | 'type' | 'description' | 'price' | 'count' | 'availableFrom' | 'availableTo' | 'status' | 'cancelledAt' | 'cancellationReason' | 'reservedAt'>
  & { imageUrl: (
    { __typename?: 'S3Object' }
    & Pick<S3Object, 'bucket' | 'region' | 'key'>
  ), restaurant: (
    { __typename?: 'Restaurant' }
    & Pick<Restaurant, 'id' | 'name'>
  ) }
);

export type NibbleRestaurantInfoFragment = (
  { __typename?: 'NibbleAvailable' }
  & { restaurant: (
    { __typename?: 'Restaurant' }
    & Pick<Restaurant, 'id' | 'name'>
    & { logoUrl: (
      { __typename?: 'S3Object' }
      & Pick<S3Object, 'bucket' | 'region' | 'key'>
    ), address: (
      { __typename?: 'Address' }
      & { location: (
        { __typename?: 'LatLon' }
        & Pick<LatLon, 'latitude' | 'longitude'>
      ) }
    ) }
  ) }
);

export type NibbleRestaurantInfoWithDistanceFragment = (
  { __typename?: 'NibbleAvailable' }
  & { restaurant: (
    { __typename?: 'Restaurant' }
    & Pick<Restaurant, 'id' | 'name' | 'distance'>
    & { logoUrl: (
      { __typename?: 'S3Object' }
      & Pick<S3Object, 'bucket' | 'region' | 'key'>
    ), address: (
      { __typename?: 'Address' }
      & { location: (
        { __typename?: 'LatLon' }
        & Pick<LatLon, 'latitude' | 'longitude'>
      ) }
    ) }
  ) }
);

export type RestaurantInfoFragment = (
  { __typename?: 'Restaurant' }
  & Pick<Restaurant, 'id' | 'name' | 'market' | 'description' | 'disclaimer' | 'active'>
  & { address: (
    { __typename?: 'Address' }
    & Pick<Address, 'streetAddress' | 'dependentLocality' | 'locality' | 'administrativeArea' | 'country' | 'postalCode'>
    & { location: (
      { __typename?: 'LatLon' }
      & Pick<LatLon, 'latitude' | 'longitude'>
    ) }
  ), logoUrl: (
    { __typename?: 'S3Object' }
    & Pick<S3Object, 'bucket' | 'region' | 'key'>
  ), heroUrl: (
    { __typename?: 'S3Object' }
    & Pick<S3Object, 'bucket' | 'key' | 'region'>
  ) }
);

export type ClosestRestaurantsQueryVariables = Exact<{
  location: LatLonInput;
  paginationInput: PaginationInput;
  maxDistance: Scalars['Float'];
}>;


export type ClosestRestaurantsQuery = (
  { __typename?: 'Query' }
  & { closestRestaurants: (
    { __typename?: 'ClosestRestaurantsResults' }
    & Pick<ClosestRestaurantsResults, 'totalResults'>
    & { restaurants: Array<(
      { __typename?: 'Restaurant' }
      & Pick<Restaurant, 'distance'>
      & RestaurantInfoFragment
    )> }
  ) }
);

export type GeocodeAddressQueryVariables = Exact<{
  addr: AddressWithoutLocationInput;
}>;


export type GeocodeAddressQuery = (
  { __typename?: 'Query' }
  & { geocodeAddress: (
    { __typename?: 'LatLon' }
    & Pick<LatLon, 'latitude' | 'longitude'>
  ) }
);

export type ImageUploadUrlQueryVariables = Exact<{
  dest: S3ObjectDestination;
}>;


export type ImageUploadUrlQuery = (
  { __typename?: 'Query' }
  & { imageUploadURL: (
    { __typename?: 'ImageUploadDestination' }
    & Pick<ImageUploadDestination, 'presignedUrl'>
    & { destination: (
      { __typename?: 'S3Object' }
      & Pick<S3Object, 'bucket' | 'region' | 'key'>
    ) }
  ) }
);

export type LocationForPostalCodeQueryVariables = Exact<{
  postalCode: Scalars['String'];
}>;


export type LocationForPostalCodeQuery = (
  { __typename?: 'Query' }
  & { locationForPostalCode: (
    { __typename?: 'LatLon' }
    & Pick<LatLon, 'latitude' | 'longitude'>
  ) }
);

export type NibbleInfoQueryVariables = Exact<{
  nibbleId: Scalars['ID'];
}>;


export type NibbleInfoQuery = (
  { __typename?: 'Query' }
  & { nibbleInfo: (
    { __typename?: 'NibbleAvailable' }
    & NibbleAvailableInfoFragment
  ) }
);

export type NibbleInfoWithRestaurantQueryVariables = Exact<{
  nibbleId: Scalars['ID'];
}>;


export type NibbleInfoWithRestaurantQuery = (
  { __typename?: 'Query' }
  & { nibbleInfo: (
    { __typename?: 'NibbleAvailable' }
    & NibbleAvailableInfoFragment
    & NibbleRestaurantInfoFragment
  ) }
);

export type NibblesWithPropertyDistanceQueryVariables = Exact<{
  userLocation: LatLonInput;
  property: NibbleRecommendationReason;
}>;


export type NibblesWithPropertyDistanceQuery = (
  { __typename?: 'Query' }
  & { nibblesWithProperty: Array<(
    { __typename?: 'NibbleAvailable' }
    & NibbleAvailableInfoFragment
    & NibbleRestaurantInfoWithDistanceFragment
  )> }
);

export type RestaurantDistanceQueryVariables = Exact<{
  restaurantId: Scalars['ID'];
  currentPos: LatLonInput;
}>;


export type RestaurantDistanceQuery = (
  { __typename?: 'Query' }
  & { restaurantInfo: (
    { __typename?: 'Restaurant' }
    & Pick<Restaurant, 'distance'>
  ) }
);

export type RestaurantForAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type RestaurantForAdminQuery = (
  { __typename?: 'Query' }
  & { restaurantForAdmin: (
    { __typename?: 'Restaurant' }
    & { nibblesAvailable: Array<(
      { __typename?: 'NibbleAvailable' }
      & NibbleAvailableInfoFragment
      & NibbleRestaurantInfoFragment
    )> }
    & RestaurantInfoFragment
  ) }
);

export type RestaurantInfoQueryVariables = Exact<{
  restaurantId: Scalars['ID'];
}>;


export type RestaurantInfoQuery = (
  { __typename?: 'Query' }
  & { restaurantInfo: (
    { __typename?: 'Restaurant' }
    & { nibblesAvailable: Array<(
      { __typename?: 'NibbleAvailable' }
      & NibbleAvailableInfoFragment
      & NibbleRestaurantInfoFragment
    )> }
    & RestaurantInfoFragment
  ) }
);

export type NibbleSearchQueryVariables = Exact<{
  searchParameters: SearchParametersInput;
  userLocation: LatLonInput;
}>;


export type NibbleSearchQuery = (
  { __typename?: 'Query' }
  & { search: (
    { __typename?: 'SearchResults' }
    & { nibbles: Array<(
      { __typename?: 'NibbleAvailable' }
      & Pick<NibbleAvailable, 'id' | 'name' | 'type' | 'count' | 'price' | 'availableFrom' | 'availableTo'>
      & { restaurant: (
        { __typename?: 'Restaurant' }
        & Pick<Restaurant, 'name'>
      ) }
    )>, restaurants: Array<(
      { __typename?: 'Restaurant' }
      & Pick<Restaurant, 'id' | 'name' | 'distance'>
      & { logoUrl: (
        { __typename?: 'S3Object' }
        & Pick<S3Object, 'region' | 'bucket' | 'key'>
      ) }
    )> }
  ) }
);

export type UserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type UserInfoQuery = (
  { __typename?: 'Query' }
  & { userInfo: (
    { __typename?: 'User' }
    & Pick<User, 'fullName' | 'email' | 'postalCode'>
    & { profilePicUrl: (
      { __typename?: 'S3Object' }
      & Pick<S3Object, 'bucket' | 'region' | 'key'>
    ), nibblesReserved: Array<(
      { __typename?: 'NibbleReserved' }
      & NibbleReservedInfoFragment
    )> }
  ) }
);
