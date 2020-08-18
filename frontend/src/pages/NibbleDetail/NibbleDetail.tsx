import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import useLocation from "../../common/hooks/useLocation";
import ActionButton from "../../components/ActionButton";
import HeroImage from "../../components/HeroImage";
import MapView from "../../components/MapView";
import { getIconForType } from "../../components/NibbleCard/NibbleCardAvailable";
import NibbleProperty, { NibblePropertyIcon } from "../../components/NibbleProperty";
import ReservationCountSelector from "../../components/ReservationCountSelector";
import { HERO_PLACEHOLDER } from "../../components/S3Image/S3Image";
import {
  MutationNibbleCreateReservationArgs,
  NibbleInfoWithRestaurantQuery,
  NibbleInfoWithRestaurantQueryVariables,
  RestaurantDistanceQuery,
  RestaurantDistanceQueryVariables
} from "../../graphql/generated/types";
import { NIBBLE_CREATE_RESERVATION } from "../../graphql/mutations";
import {
  NIBBLE_INFO_WITH_RESTAURANT,
  RESTAURANT_DISTANCE,
  USER_INFO_NIBBLES_RESERVED
} from "../../graphql/queries";
import { MessageType, showMessage } from "../../redux/actions";
import { useStyles } from "./NibbleDetail.style";

const formatAsCurrency = (cents: number) => {
  return `$${(cents / 100).toFixed(2)}`;
};

const NibbleDetail = () => {
  let { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [currentCount, setCurrentCount] = useState(1);
  const { loading, error, data } = useQuery<
    NibbleInfoWithRestaurantQuery,
    NibbleInfoWithRestaurantQueryVariables
  >(NIBBLE_INFO_WITH_RESTAURANT, {
    variables: { nibbleId: id },
  });

  const [fetchRestaurantDistance, { data: restaurantDistanceData }] = useLazyQuery<
    RestaurantDistanceQuery,
    RestaurantDistanceQueryVariables
  >(RESTAURANT_DISTANCE);

  const [makeReservation, { loading: reservationLoading }] = useMutation<
    any,
    MutationNibbleCreateReservationArgs
  >(NIBBLE_CREATE_RESERVATION);

  // get restaurant distance
  useEffect(() => {
    if (location.location && data?.nibbleInfo.restaurant.id) {
      fetchRestaurantDistance({
        variables: {
          currentPos: location.location,
          restaurantId: data?.nibbleInfo.restaurant.id,
        },
      });
    }
  }, [location.loading, location.location, data, fetchRestaurantDistance]);

  // redirect on error
  useEffect(() => {
    if (error) {
      console.log(`Error getting Nibble info: ${error.message}.`);
      history.push("/");
      dispatch(
        showMessage(`Error getting Nibble info: ${error.message}.`, MessageType.Error)
      );
    }
  }, [error, dispatch, history]);

  // on reservation button click
  const onReservationClick = useCallback(async () => {
    if (data) {
      try {
        await makeReservation({
          variables: { nibbleId: data.nibbleInfo.id, count: currentCount },
          refetchQueries: [{ query: USER_INFO_NIBBLES_RESERVED }],
        });
        console.log("Successfully reserved");
        dispatch(
          showMessage(
            `Successfully reserved ${currentCount} Nibble${
              currentCount !== 1 ? "s" : ""
            }`,
            MessageType.Success
          )
        );
        history.push("/");
      } catch (e) {
        console.log(e);
        dispatch(
          showMessage(`Error reserving Nibble: ${e.message}`, MessageType.Error)
        );
      }
    }
  }, [currentCount, data, dispatch, history, makeReservation]);

  return (
    <div className={classes.mainContent}>
      {loading || error ? (
        <div>
          <HeroImage loading={true} />
        </div>
      ) : (
        data && (
          <div>
            <HeroImage location={data.nibbleInfo.imageUrl || HERO_PLACEHOLDER} />
            <div className={classes.fixedContainer}>
              <div className={classes.detailsContainer}>
                <h1>{data.nibbleInfo.name}</h1>
                <div className={classes.priceNameContainer}>
                  <h3 id={"price"}>{formatAsCurrency(data.nibbleInfo.price)}</h3>
                  <p id={"separator"}>|</p>
                  <Link
                    to={{ pathname: `/restaurant/${data.nibbleInfo.restaurant.id}` }}
                  >
                    <h3 id={"restaurant"}>{data.nibbleInfo.restaurant.name}</h3>
                  </Link>
                </div>
                <div className={classes.properties}>
                  <NibbleProperty
                    icon={getIconForType(data.nibbleInfo.type)}
                    text={data.nibbleInfo.type}
                  />
                  <NibbleProperty
                    icon={NibblePropertyIcon.Time}
                    text={moment.unix(data.nibbleInfo.availableTo).calendar()}
                  />
                  {restaurantDistanceData && (
                    <NibbleProperty
                      icon={NibblePropertyIcon.Location}
                      text={`${restaurantDistanceData.restaurantInfo.distance.toFixed(
                        1
                      )} miles`}
                    />
                  )}
                </div>
              </div>
              {data.nibbleInfo.description && (
                <div className={classes.description}>{data.nibbleInfo.description}</div>
              )}
              <div className={classes.reservationContainer}>
                <ReservationCountSelector
                  availableCount={data.nibbleInfo.count}
                  currentCount={currentCount}
                  onCountChange={(change: number) => {
                    setCurrentCount(currentCount + change);
                  }}
                />
              </div>
            </div>
            <MapView pins={[data.nibbleInfo.restaurant]} height={"40vh"} />
            <ActionButton
              disabled={!data || data.nibbleInfo.count === 0 || reservationLoading}
              onClick={onReservationClick}
            >
              {`Reserve ${currentCount} now (${formatAsCurrency(
                data.nibbleInfo.price * currentCount
              )})`}
            </ActionButton>
          </div>
        )
      )}
    </div>
  );
};

export default NibbleDetail;
