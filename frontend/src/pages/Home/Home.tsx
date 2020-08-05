import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { useLazyQuery, useQuery } from "@apollo/client";
import Auth from "@aws-amplify/auth";

import useLocation from "../../common/hooks/useLocation";
import { appTheme } from "../../common/theming/theming";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import MapView from "../../components/MapView";
import { PROFILE_PICTURE_PLACEHOLDER } from "../../components/S3Image/S3Image";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import {
  ClosestRestaurantsQuery,
  ClosestRestaurantsQueryVariables,
  UserInfoQuery,
  UserInfoQueryVariables
} from "../../graphql/generated/types";
import { CLOSEST_RESTAURANTS, USER_INFO } from "../../graphql/queries";
import { userSignOut } from "../../redux/actions";
import { useStyles } from "./Home.style";

const Home = () => {
  const { loading, error, data } = useQuery<UserInfoQuery, UserInfoQueryVariables>(
    USER_INFO
  );

  const { location, loading: locationLoading } = useLocation();

  const [fetchRestaurants, { data: restaurantData }] = useLazyQuery<
    ClosestRestaurantsQuery,
    ClosestRestaurantsQueryVariables
  >(CLOSEST_RESTAURANTS);

  useEffect(() => {
    if (!locationLoading && location) {
      fetchRestaurants({
        variables: {
          location,
          paginationInput: { offset: 0, limit: 10 },
          maxDistance: 2.5,
        },
      });
    }
  }, [locationLoading, location, fetchRestaurants]);

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
