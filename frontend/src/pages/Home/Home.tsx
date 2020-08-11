import React, { useEffect } from "react";
import { useTheme } from "react-jss";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { useLazyQuery, useQuery } from "@apollo/client";
import Auth from "@aws-amplify/auth";

import useLocation from "../../common/hooks/useLocation";
import { AppTheme } from "../../common/theming/theming.types";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import {
  NibbleCollectionAvailable,
  NibbleCollectionLoading,
  NibbleCollectionReserved
} from "../../components/NibbleCollection";
import { PROFILE_PICTURE_PLACEHOLDER } from "../../components/S3Image/S3Image";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import {
  NibbleRecommendationReason,
  NibblesWithPropertyDistanceQuery,
  NibblesWithPropertyDistanceQueryVariables,
  UserInfoQuery,
  UserInfoQueryVariables
} from "../../graphql/generated/types";
import { NIBBLES_WITH_PROPERTY_DISTANCE, USER_INFO } from "../../graphql/queries";
import { userSignOut } from "../../redux/actions";
import { useStyles } from "./Home.style";

const Home = () => {
  const { data } = useQuery<UserInfoQuery, UserInfoQueryVariables>(USER_INFO);
  const [fetchNearbyNibbles, { data: nearbyNibbles }] = useLazyQuery<
    NibblesWithPropertyDistanceQuery,
    NibblesWithPropertyDistanceQueryVariables
  >(NIBBLES_WITH_PROPERTY_DISTANCE);
  const [fetchAvailableNibbles, { data: availableNibbles }] = useLazyQuery<
    NibblesWithPropertyDistanceQuery,
    NibblesWithPropertyDistanceQueryVariables
  >(NIBBLES_WITH_PROPERTY_DISTANCE);
  const appTheme = useTheme() as AppTheme;
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();

  // fetch nibbles with property
  useEffect(() => {
    if (!location.loading) {
      fetchNearbyNibbles({
        variables: {
          property: NibbleRecommendationReason.Distance,
          userLocation: location.location,
        },
      });
      fetchAvailableNibbles({
        variables: {
          property: NibbleRecommendationReason.AvailableNow,
          userLocation: location.location,
        },
      });
    }
  }, [location.loading, location.location, fetchNearbyNibbles, fetchAvailableNibbles]);

  return (
    <div>
      <HeaderBar
        profilePicUrl={data?.userInfo.profilePicUrl || PROFILE_PICTURE_PLACEHOLDER}
      />
      <div className={classes.mainContent}>
        {data && data.userInfo.nibblesReserved.length > 0 && (
          <div>
            <SectionHeader name="Your Nibbles" color={appTheme.color.blue} />

            <NibbleCollectionReserved nibbles={data.userInfo.nibblesReserved} />
          </div>
        )}
        <SectionHeader name="Near You" color={appTheme.color.text.primary} />
        {(nearbyNibbles && (
          <NibbleCollectionAvailable nibbles={nearbyNibbles.nibblesWithProperty} />
        )) || <NibbleCollectionLoading />}
        <SectionHeader name={"Ready Now"} color={appTheme.color.text.primary} />
        {(availableNibbles && (
          <NibbleCollectionAvailable nibbles={availableNibbles.nibblesWithProperty} />
        )) || <NibbleCollectionLoading />}
        <Link
          to={{ pathname: "/login", state: { referrer: "/" } }}
          onClick={async () => {
            dispatch(userSignOut());
            await Auth.signOut();
          }}
        >
          Sign out
        </Link>
      </div>
    </div>
  );
};

export default Home;
