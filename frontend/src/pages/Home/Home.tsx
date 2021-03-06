import React, { useEffect, useState } from "react";
import { useTheme } from "react-jss";
import { Link, useHistory } from "react-router-dom";

import { useLazyQuery, useQuery } from "@apollo/client";

import useLocation from "../../common/hooks/useLocation";
import { AppTheme } from "../../common/theming/theming.types";
import ActionButton from "../../components/ActionButton";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import {
  NibbleCollectionAvailable,
  NibbleCollectionLoading,
  NibbleCollectionReserved
} from "../../components/NibbleCollection";
import {
  NibbleFeaturedCard,
  NibbleFeaturedCardLoading
} from "../../components/NibbleFeaturedCard";
import {
  NibbleFeaturedCardProps
} from "../../components/NibbleFeaturedCard/NibbleFeaturedCard.types";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import {
  NibbleRecommendationReason,
  NibblesWithPropertyDistanceQuery,
  NibblesWithPropertyDistanceQueryVariables,
  UserInfoNibblesReservedQuery,
  UserInfoNibblesReservedQueryVariables
} from "../../graphql/generated/types";
import {
  NIBBLES_WITH_PROPERTY_DISTANCE,
  USER_INFO_NIBBLES_RESERVED
} from "../../graphql/queries";
import { useStyles } from "./Home.style";

const Home = () => {
  const { data } = useQuery<
    UserInfoNibblesReservedQuery,
    UserInfoNibblesReservedQueryVariables
  >(USER_INFO_NIBBLES_RESERVED);
  const [fetchNearbyNibbles, { data: nearbyNibbles }] = useLazyQuery<
    NibblesWithPropertyDistanceQuery,
    NibblesWithPropertyDistanceQueryVariables
  >(NIBBLES_WITH_PROPERTY_DISTANCE);
  const [fetchAvailableNibbles, { data: availableNibbles }] = useLazyQuery<
    NibblesWithPropertyDistanceQuery,
    NibblesWithPropertyDistanceQueryVariables
  >(NIBBLES_WITH_PROPERTY_DISTANCE);
  const [fetchRecommendedNibbles, { data: recommendedNibbles }] = useLazyQuery<
    NibblesWithPropertyDistanceQuery,
    NibblesWithPropertyDistanceQueryVariables
  >(NIBBLES_WITH_PROPERTY_DISTANCE);
  const appTheme = useTheme() as AppTheme;
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [recommended, setRecommended] = useState<NibbleFeaturedCardProps[]>([]);
  const [recommendedCount, setRecommendedCount] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);

  // update window width
  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
      fetchRecommendedNibbles({
        variables: {
          property: NibbleRecommendationReason.Recommended,
          userLocation: location.location,
        },
      });
    }
  }, [
    location.loading,
    location.location,
    fetchNearbyNibbles,
    fetchAvailableNibbles,
    fetchRecommendedNibbles,
  ]);

  // based on width fetch either 1 or 2 recommended nibbles
  useEffect(() => {
    if (width <= 620) {
      setRecommendedCount(1);
    } else {
      setRecommendedCount(2);
    }
    if (recommendedNibbles) {
      setRecommended(
        recommendedNibbles.nibblesWithProperty
          .filter((nibble) => nibble.count > 0)
          .slice(0, recommendedCount)
      );
    }
  }, [recommendedNibbles, recommendedCount, width]);

  return (
    <div>
      <HeaderBar />
      <div className={classes.mainContent}>
        {data && data.userInfo.nibblesReserved.length > 0 && (
          <div>
            <SectionHeader name="Your Nibbles" color={appTheme.color.blue} />
            <NibbleCollectionReserved nibbles={data.userInfo.nibblesReserved} />
          </div>
        )}
        <SectionHeader name="Recommended" color={appTheme.color.pink} />
        <div className={classes.recommendedCollection}>
          {(recommendedNibbles &&
            recommended.map((nibble) => (
              <Link to={{ pathname: `/nibble/${nibble.id}` }} key={nibble.id}>
                <NibbleFeaturedCard {...nibble} />
              </Link>
            ))) ||
            Array.from({ length: recommendedCount }).map((_, index) => (
              <NibbleFeaturedCardLoading key={index} />
            ))}
        </div>
        <SectionHeader name="Near You" color={appTheme.color.text.primary} />
        {(nearbyNibbles && (
          <NibbleCollectionAvailable nibbles={nearbyNibbles.nibblesWithProperty} />
        )) || <NibbleCollectionLoading />}
        <SectionHeader name={"Ready Now"} color={appTheme.color.text.primary} />
        {(availableNibbles && (
          <NibbleCollectionAvailable nibbles={availableNibbles.nibblesWithProperty} />
        )) || <NibbleCollectionLoading />}
        <ActionButton
          disabled={false}
          onClick={() => history.push("/restaurants")}
          color={appTheme.color.blue}
        >
          See all restaurants
        </ActionButton>
      </div>
    </div>
  );
};

export default Home;
