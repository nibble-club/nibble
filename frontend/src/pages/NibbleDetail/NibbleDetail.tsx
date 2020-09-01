import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "react-jss";
import { useDispatch } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import useLocation from "../../common/hooks/useLocation";
import { AppTheme } from "../../common/theming/theming.types";
import ActionButton from "../../components/ActionButton";
import HeroImage from "../../components/HeroImage";
import MapView from "../../components/MapView";
import { getIconForType } from "../../components/NibbleCard/NibbleCardAvailable";
import NibbleProperty, { NibblePropertyIcon } from "../../components/NibbleProperty";
import ReservationCountSelector from "../../components/ReservationCountSelector";
import { HERO_PLACEHOLDER } from "../../components/S3Image/S3Image";
import {
  MutationNibbleCancelReservationArgs,
  MutationNibbleCreateReservationArgs,
  MutationNibbleEditReservationArgs,
  NibbleInfoWithRestaurantQuery,
  NibbleInfoWithRestaurantQueryVariables,
  NibbleReservationQuery,
  NibbleReservationQueryVariables,
  NibbleReservationStatus,
  RestaurantDistanceQuery,
  RestaurantDistanceQueryVariables
} from "../../graphql/generated/types";
import {
  NIBBLE_CANCEL_RESERVATION,
  NIBBLE_CREATE_RESERVATION,
  NIBBLE_EDIT_RESERVATION
} from "../../graphql/mutations";
import {
  NIBBLE_INFO_WITH_RESTAURANT,
  NIBBLE_RESERVATION,
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
  const appTheme = useTheme() as AppTheme;
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [currentCount, setCurrentCount] = useState(1);
  const [hasReservation, setHasReservation] = useState(false);
  const [reservationDisabled, setReservationDisabled] = useState(false);
  const [alerts, setAlerts] = useState<Array<string>>([]);
  const { loading, error, data } = useQuery<
    NibbleInfoWithRestaurantQuery,
    NibbleInfoWithRestaurantQueryVariables
  >(NIBBLE_INFO_WITH_RESTAURANT, {
    variables: { nibbleId: id },
  });

  const { data: reservationData } = useQuery<
    NibbleReservationQuery,
    NibbleReservationQueryVariables
  >(NIBBLE_RESERVATION, { variables: { nibbleId: id } });

  const [fetchRestaurantDistance, { data: restaurantDistanceData }] = useLazyQuery<
    RestaurantDistanceQuery,
    RestaurantDistanceQueryVariables
  >(RESTAURANT_DISTANCE);

  const [makeReservation, { loading: reservationLoading }] = useMutation<
    any,
    MutationNibbleCreateReservationArgs
  >(NIBBLE_CREATE_RESERVATION);

  const [editReservation, { loading: editReservationLoading }] = useMutation<
    any,
    MutationNibbleEditReservationArgs
  >(NIBBLE_EDIT_RESERVATION);

  const [cancelReservation, { loading: cancelReservationLoading }] = useMutation<
    any,
    MutationNibbleCancelReservationArgs
  >(NIBBLE_CANCEL_RESERVATION);

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

  // update page if reservation exists
  useEffect(() => {
    if (reservationData) {
      if (
        reservationData.nibbleReservation &&
        reservationData.nibbleReservation.status === NibbleReservationStatus.Reserved
      ) {
        setHasReservation(true);
        setCurrentCount(reservationData.nibbleReservation.count);
      } else if (
        reservationData.nibbleReservation &&
        reservationData.nibbleReservation.status ===
          NibbleReservationStatus.CancelledByRestaurant
      ) {
        setReservationDisabled(true);
        setHasReservation(false);
        setCurrentCount(reservationData.nibbleReservation.count);
        setAlerts((alerts) =>
          alerts.concat(
            `Your reservation was cancelled by the restaurant ${moment
              .unix(reservationData.nibbleReservation?.cancelledAt)
              .fromNow()}`
          )
        );
      } else if (
        reservationData.nibbleReservation &&
        reservationData.nibbleReservation.status ===
          NibbleReservationStatus.CancelledByUser
      ) {
        setHasReservation(false);
        setAlerts((alerts) =>
          alerts.concat(
            `You cancelled your reservation ${moment
              .unix(reservationData.nibbleReservation?.cancelledAt)
              .fromNow()}`
          )
        );
      } else if (
        reservationData.nibbleReservation &&
        reservationData.nibbleReservation.status === NibbleReservationStatus.Completed
      ) {
        setHasReservation(true);
        setCurrentCount(reservationData.nibbleReservation.count);
        setReservationDisabled(true);
        setAlerts((alerts) =>
          alerts.concat("Reservation already completed; try a different Nibble")
        );
      } else {
        // no reservation
        setHasReservation(false);
      }
    }
  }, [reservationData]);

  // update page on data load
  useEffect(() => {
    if (data) {
      const availableFrom = moment.unix(data.nibbleInfo.availableFrom);
      const availableTo = moment.unix(data.nibbleInfo.availableTo);
      if (availableFrom.isAfter()) {
        setAlerts((alerts) =>
          alerts.concat(
            `Nibble not available for pickup until ${availableFrom.fromNow(
              true
            )} from now`
          )
        );
      }
      if (availableTo.isBefore()) {
        setAlerts((alerts) => alerts.concat("Nibble no longer available"));
        setReservationDisabled(true);
      }
    }
  }, [data]);

  // on reservation button click
  const onReservationClick = useCallback(async () => {
    if (data) {
      try {
        if (hasReservation && currentCount > 0) {
          await editReservation({
            variables: { nibbleId: data.nibbleInfo.id, newCount: currentCount },
            refetchQueries: [
              { query: NIBBLE_INFO_WITH_RESTAURANT, variables: { nibbleId: id } },
              { query: USER_INFO_NIBBLES_RESERVED },
              { query: NIBBLE_RESERVATION, variables: { nibbleId: id } },
            ],
          });
        } else if (hasReservation && currentCount <= 0) {
          await cancelReservation({
            variables: { nibbleId: data.nibbleInfo.id },
            refetchQueries: [
              { query: NIBBLE_INFO_WITH_RESTAURANT, variables: { nibbleId: id } },
              { query: USER_INFO_NIBBLES_RESERVED },
              { query: NIBBLE_RESERVATION, variables: { nibbleId: id } },
            ],
          });
        } else {
          await makeReservation({
            variables: { nibbleId: data.nibbleInfo.id, count: currentCount },
            refetchQueries: [
              { query: NIBBLE_INFO_WITH_RESTAURANT, variables: { nibbleId: id } },
              { query: USER_INFO_NIBBLES_RESERVED },
              { query: NIBBLE_RESERVATION, variables: { nibbleId: id } },
            ],
          });
        }
        console.log("Successfully reserved");
        if (hasReservation && currentCount > 0) {
          dispatch(
            showMessage(`Successfully updated Nibble reservation`, MessageType.Success)
          );
        } else if (hasReservation) {
          dispatch(
            showMessage(`Successfully cancelled reservation`, MessageType.Information)
          );
        } else {
          dispatch(
            showMessage(
              `Successfully reserved ${currentCount} Nibble${
                currentCount !== 1 ? "s" : ""
              }`,
              MessageType.Success
            )
          );
        }
        history.push("/");
      } catch (e) {
        console.log(e);
        dispatch(
          showMessage(
            `Error updating Nibble reservation: ${e.message}`,
            MessageType.Error
          )
        );
      }
    }
  }, [
    currentCount,
    data,
    dispatch,
    history,
    makeReservation,
    editReservation,
    cancelReservation,
    hasReservation,
    id,
  ]);

  const availableCount =
    (data?.nibbleInfo.count || 0) +
    (hasReservation ? reservationData?.nibbleReservation?.count || 0 : 0);

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
                {alerts.length > 0 && (
                  <div className={classes.alertsContainer}>
                    {alerts.map((alert, index) => (
                      <NibbleProperty
                        key={index}
                        icon={NibblePropertyIcon.Alert}
                        text={alert}
                      />
                    ))}
                  </div>
                )}
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
                    text={`Pickup by: ${moment
                      .unix(data.nibbleInfo.availableTo)
                      .calendar()
                      .toLowerCase()}`}
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
                  availableCount={availableCount}
                  currentCount={currentCount}
                  onCountChange={(change: number) => {
                    setCurrentCount(currentCount + change);
                  }}
                />
              </div>
            </div>
            <MapView pins={[data.nibbleInfo.restaurant]} height={"40vh"} />
            <ActionButton
              disabled={
                !data ||
                availableCount <= 0 ||
                reservationLoading ||
                editReservationLoading ||
                cancelReservationLoading ||
                reservationDisabled ||
                (hasReservation &&
                  reservationData?.nibbleReservation?.count === currentCount) ||
                (!hasReservation && currentCount === 0)
              }
              onClick={onReservationClick}
              color={
                hasReservation && currentCount > 0
                  ? appTheme.color.blue
                  : hasReservation
                  ? appTheme.color.text.alert
                  : appTheme.color.green
              }
            >
              {hasReservation && currentCount > 0
                ? `Update reservation`
                : hasReservation
                ? "Cancel reservation"
                : `Reserve ${currentCount} now (${formatAsCurrency(
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
