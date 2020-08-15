import React, { useEffect } from "react";
import { useTheme } from "react-jss";
import * as ReactRouter from "react-router-dom";

import { useLazyQuery } from "@apollo/client";

import useLocation from "../../common/hooks/useLocation";
import { AppTheme } from "../../common/theming/theming.types";
import HeaderBar from "../../components/HeaderBar";
import {
  NibbleCollectionAvailable,
  NibbleCollectionLoading
} from "../../components/NibbleCollection";
import RestaurantCard from "../../components/RestaurantCard";
import {
  RestaurantCardLoading
} from "../../components/RestaurantCard/RestaurantCardLoading";
import SectionHeader from "../../components/SectionHeader";
import { SearchQuery, SearchQueryVariables } from "../../graphql/generated/types";
import { SEARCH } from "../../graphql/queries";
import { useStyles } from "./Search.style";

const Search = () => {
  const classes = useStyles();
  const appTheme = useTheme() as AppTheme;
  // fetch search info from browser URL
  const location = ReactRouter.useLocation();
  const params = new URLSearchParams(location.search);
  const query = decodeURI(params.get("query") || "");
  const maxDistance = parseFloat(params.get("maxDistance") || "") || null;
  const pickupAfter = parseInt(params.get("pickupAfter") || "") || null;

  const userLocation = useLocation();

  const [fetchSearch, { error, data }] = useLazyQuery<
    SearchQuery,
    SearchQueryVariables
  >(SEARCH);

  // fetch results on location loaded
  useEffect(() => {
    if (!userLocation.loading) {
      fetchSearch({
        variables: {
          searchParameters: {
            text: query,
            maxDistance,
            pickupAfter,
          },
          userLocation: userLocation.location,
        },
      });
    }
  }, [
    fetchSearch,
    pickupAfter,
    maxDistance,
    query,
    userLocation.location,
    userLocation.loading,
  ]);

  return (
    <div>
      <HeaderBar />
      <div className={classes.mainContent}>
        <div className={classes.term}>
          <p>Search term: {query}</p>
        </div>
        {error ? (
          <div>
            <p className={classes.noResults}>Error with search: {error.message}</p>
          </div>
        ) : !data ? (
          <div>
            <SectionHeader name={"Nibbles"} color={appTheme.color.blue} />
            <NibbleCollectionLoading count={3} />
            <SectionHeader name={"Restaurants"} color={appTheme.color.green} />
            <div className={classes.restaurants}>
              {Array.from({ length: 10 }).map((_, index) => (
                <RestaurantCardLoading key={index} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <SectionHeader name={"Nibbles"} color={appTheme.color.blue} />
            {data.search.nibbles.length > 0 ? (
              <NibbleCollectionAvailable nibbles={data.search.nibbles} />
            ) : (
              <p className={classes.noResults}>No Nibbles found</p>
            )}
            <SectionHeader name={"Restaurants"} color={appTheme.color.green} />
            {data.search.restaurants.length > 0 ? (
              <div className={classes.restaurants}>
                {data.search.restaurants.map((restaurant, index) => (
                  <RestaurantCard key={restaurant.id} {...restaurant} />
                ))}
              </div>
            ) : (
              <p className={classes.noResults}>No restaurants found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
