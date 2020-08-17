import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { useLazyQuery } from "@apollo/client";

import useLocation from "../../common/hooks/useLocation";
import DistanceSelector from "../../components/DistanceSelector";
import HeaderBar from "../../components/HeaderBar";
import LoadingOverlay from "../../components/LoadingOverlay";
import MapView from "../../components/MapView";
import RestaurantCard from "../../components/RestaurantCard";
import {
  RESTAURANT_CARD_MARGIN
} from "../../components/RestaurantCard/RestaurantCard.style";
import {
  RestaurantCardLoading
} from "../../components/RestaurantCard/RestaurantCardLoading";
import {
  ClosestRestaurantsQuery,
  ClosestRestaurantsQueryVariables
} from "../../graphql/generated/types";
import { CLOSEST_RESTAURANTS } from "../../graphql/queries";
import { MessageType, showMessage } from "../../redux/actions";
import { MAP_HEIGHT, useStyles } from "./RestaurantsMapView.style";

// constants
const RESTAURANT_COUNT = 10;
const MAX_DISTANCE = 3; // miles
const MOBILE_CUTOFF = 620; // px

const RestaurantsMapView = () => {
  const classes = useStyles();
  const [
    fetchClosestRestaurants,
    { data: restaurantData, loading, error },
  ] = useLazyQuery<ClosestRestaurantsQuery, ClosestRestaurantsQueryVariables>(
    CLOSEST_RESTAURANTS
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchOffset, setSearchOffset] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const [scrollPos, setScrollPos] = useState(window.scrollY);
  const cardHeightRef = useRef<HTMLDivElement>(null);
  const [maxDistance, setMaxDistance] = useState(MAX_DISTANCE);

  // update window width
  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // listen to scroll position
  useEffect(() => {
    const onScroll = () => {
      setScrollPos(window.scrollY);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fetch restaurants once we have location
  useEffect(() => {
    if (!location.loading) {
      fetchClosestRestaurants({
        variables: {
          location: location.location,
          paginationInput: { limit: RESTAURANT_COUNT, offset: searchOffset },
          maxDistance: maxDistance,
        },
      });
    }
  }, [location, fetchClosestRestaurants, searchOffset, maxDistance]);

  // scroll to top once restaurants loaded
  useEffect(() => {
    if (loading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [loading]);

  // redirect on error
  useEffect(() => {
    if (error) {
      console.log(`Error getting Nibble info: ${error.message}.`);
      history.push("/");
      dispatch(
        showMessage(`Error getting Nibble info: ${error.message}.`, MessageType.Error)
      );
    }
  }, [error, history, dispatch]);

  // move to first page if current page is over limit; happens when someone changes
  // max distance down while not on first page
  useEffect(() => {
    if (
      (restaurantData?.closestRestaurants.totalResults || Number.MAX_SAFE_INTEGER) <
      searchOffset
    ) {
      setSearchOffset(0);
    }
  }, [restaurantData, searchOffset]);

  // inner components for cards and search
  const RestaurantsLoadingList = useCallback(
    () =>
      Array.from({ length: RESTAURANT_COUNT }).map((_, index) => (
        <RestaurantCardLoading key={index} />
      )),
    []
  );

  const RestaurantsList = useCallback(
    (
      restaurantData: ClosestRestaurantsQuery,
      cardHeightRef: React.RefObject<HTMLDivElement>
    ) =>
      restaurantData.closestRestaurants.restaurants.map((restaurant, index) => (
        <RestaurantCard
          key={restaurant.id}
          divRef={index === 0 ? cardHeightRef : undefined}
          {...restaurant}
        />
      )),
    []
  );

  const PaginationButtons = useCallback(
    (restaurantData: ClosestRestaurantsQuery) => (
      <div className={classes.paginationContainer}>
        <div className={classes.pagination}>
          <button
            disabled={searchOffset === 0}
            onClick={() => {
              setSearchOffset((searchOffset) => searchOffset - RESTAURANT_COUNT);
            }}
          >
            <div className={classes.innerButton}>
              <i className={"material-icons-outlined"}>chevron_left</i>
            </div>
          </button>
          <p>
            {`${Math.min(
              searchOffset + 1,
              restaurantData.closestRestaurants.totalResults
            )}-${Math.min(
              searchOffset + RESTAURANT_COUNT,
              restaurantData.closestRestaurants.totalResults
            )} of ${restaurantData.closestRestaurants.totalResults}`}
          </p>
          <button
            disabled={
              searchOffset + RESTAURANT_COUNT >=
              restaurantData.closestRestaurants.totalResults
            }
            onClick={() => {
              setSearchOffset((searchOffset) => searchOffset + RESTAURANT_COUNT);
            }}
          >
            <div className={classes.innerButton}>
              <i className={"material-icons-outlined"}>chevron_right</i>
            </div>
          </button>
        </div>
        <div className={classes.distance}>
          <p>Set maximum distance:</p>
          <DistanceSelector
            max={10}
            onDistanceChange={(distance) => {
              setMaxDistance(distance);
            }}
            startValue={maxDistance}
          />
        </div>
      </div>
    ),
    [
      classes.pagination,
      classes.innerButton,
      classes.paginationContainer,
      classes.distance,
      searchOffset,
      maxDistance,
    ]
  );

  const activePin =
    scrollPos > 0 && !loading
      ? Math.floor(
          (scrollPos + 20) / // offset by 20px
            ((cardHeightRef.current?.offsetHeight || 100) + RESTAURANT_CARD_MARGIN)
        )
      : -1;

  return (
    <div>
      <HeaderBar />
      <div className={classes.mainContent}>
        <LoadingOverlay show={loading || location.loading} />
        <div className={width <= MOBILE_CUTOFF ? classes.map : classes.mapDesktop}>
          <MapView
            pins={restaurantData?.closestRestaurants.restaurants || []}
            height={width <= MOBILE_CUTOFF ? MAP_HEIGHT : "100vh"}
            activePin={activePin}
          />
        </div>
        {width <= MOBILE_CUTOFF ? (
          <div>
            {location.loading || loading || error ? (
              <div className={classes.restaurantList}>{RestaurantsLoadingList()}</div>
            ) : (
              restaurantData && (
                <div className={classes.restaurantList}>
                  {RestaurantsList(restaurantData, cardHeightRef)}
                  {PaginationButtons(restaurantData)}
                </div>
              )
            )}
          </div>
        ) : (
          <div>
            {location.loading || loading || error ? (
              <div className={classes.restaurantListDesktop}>
                <div className={classes.restaurantInnerListDesktop}>
                  {RestaurantsLoadingList()}
                </div>
              </div>
            ) : (
              restaurantData && (
                <div className={classes.restaurantListDesktop}>
                  <div className={classes.restaurantInnerListDesktop}>
                    {RestaurantsList(restaurantData, cardHeightRef)}
                  </div>
                  {PaginationButtons(restaurantData)}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsMapView;
