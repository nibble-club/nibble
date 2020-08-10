import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useLazyQuery } from "@apollo/client";

import {
  LatLon,
  LocationForPostalCodeQuery,
  LocationForPostalCodeQueryVariables
} from "../../graphql/generated/types";
import { LOCATION_FOR_POSTAL_CODE } from "../../graphql/queries";
import { userLocation } from "../../redux/actions";
import { RootState } from "../../redux/reducers";

export type LocationResult =
  | { location: null; loading: true }
  | { location: LatLon; loading: false };

function useLocation(): LocationResult {
  const dispatch = useDispatch();
  const postalCode = useSelector((state: RootState) => state.userPostalCode.postalCode);
  const location = useSelector((state: RootState) => state.userLocation.location);

  const [fetchLocationFromPostalCode, { data }] = useLazyQuery<
    LocationForPostalCodeQuery,
    LocationForPostalCodeQueryVariables
  >(LOCATION_FOR_POSTAL_CODE, { variables: { postalCode } });

  const [browserLocationLoading, setBrowserLocationLoading] = useState(false);
  const [browserLocationBlocked, setBrowserLocationBlocked] = useState(false);

  const [locationResult, setLocationResult] = useState<LocationResult>({
    loading: true,
    location: null,
  });

  useEffect(() => {
    if (!locationResult.loading) {
      return;
    }
    if (location.latitude !== 0 && location.longitude !== 0) {
      // already have non-default location
      setLocationResult({ location, loading: false });
    }
    // don't have user location; ask for permission first, and set state in callback
    else if (
      "geolocation" in navigator &&
      !browserLocationLoading &&
      !browserLocationBlocked
    ) {
      setBrowserLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          console.log("Got user position from browser");
          dispatch(
            userLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          );
          setLocationResult({
            loading: false,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
          setBrowserLocationLoading(false);
        },
        () => {
          console.log("Error getting user position from browser");
          setBrowserLocationBlocked(true);
          setBrowserLocationLoading(false);
        },
        { enableHighAccuracy: true }
      );
    }
    // don't have user location, don't have access to GPS; fetch location from postal code
    else if (postalCode.length > 0 && !browserLocationLoading) {
      fetchLocationFromPostalCode();
      if (data) {
        console.log("Setting location from postal code");
        dispatch(
          userLocation({
            latitude: data.locationForPostalCode.latitude,
            longitude: data.locationForPostalCode.longitude,
          })
        );
        setLocationResult({
          location: {
            latitude: data.locationForPostalCode.latitude,
            longitude: data.locationForPostalCode.longitude,
          },
          loading: false,
        });
      }
    }
  }, [
    dispatch,
    fetchLocationFromPostalCode,
    location,
    postalCode.length,
    data,
    locationResult.loading,
    browserLocationLoading,
    browserLocationBlocked,
  ]);

  return locationResult;
}

export default useLocation;
