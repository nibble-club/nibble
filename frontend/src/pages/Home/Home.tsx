import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { QueryResult, useQuery } from "@apollo/client";
import Auth from "@aws-amplify/auth";

import { appTheme } from "../../common/theming";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import MapView from "../../components/MapView";
import { PROFILE_PICTURE_PLACEHOLDER } from "../../components/S3Image/S3Image";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import {
  ClosestRestaurantsQuery,
  ClosestRestaurantsQueryVariables,
  UserInfoQuery
} from "../../graphql/generated/types";
import { CLOSEST_RESTAURANTS, USER_INFO } from "../../graphql/queries";
import { userSignOut } from "../../redux/actions";
import { useStyles } from "./Home.style";

const Home = () => {
  const { loading, error, data } = useQuery(USER_INFO) as QueryResult<
    UserInfoQuery,
    null
  >;

  const { data: restaurantData } = useQuery(CLOSEST_RESTAURANTS, {
    variables: {
      location: {
        latitude: 42.3854646,
        longitude: -71.094187,
      },
      paginationInput: {
        offset: 40,
        limit: 20,
      },
      maxDistance: 3.5,
    },
  }) as QueryResult<ClosestRestaurantsQuery, ClosestRestaurantsQueryVariables>;

  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <div>
      <HeaderBar
        profilePicUrl={data?.userInfo.profilePicUrl || PROFILE_PICTURE_PLACEHOLDER}
      />
      <div className={classes.mainContent}>
        <SectionHeader name="Your Nibbles" color={appTheme.color.blue} />
        <h1>Hello!</h1>
        <h3>
          Your name:{" "}
          {loading ? "loading..." : error ? "error!" : data?.userInfo.fullName}
        </h3>
        <Link
          to={{ pathname: "/login", state: { referrer: "/" } }}
          onClick={async () => {
            dispatch(userSignOut());
            await Auth.signOut();
          }}
        >
          Sign out
        </Link>
        <MapView
          pins={restaurantData ? restaurantData.closestRestaurants.restaurants : []}
        />
      </div>
    </div>
  );
};

export default Home;
