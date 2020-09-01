import moment from "moment";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { useMutation } from "@apollo/client";

import useOutsideClickAlerter from "../../common/hooks/useOutsideClickAlerter";
import { multipleClasses } from "../../common/theming/theming";
import {
  MutationAdminCancelReservationArgs,
  NibbleReservationStatus
} from "../../graphql/generated/types";
import { ADMIN_CANCEL_RESERVATION } from "../../graphql/mutations";
import { ADMIN_NIBBLE_RESERVATIONS } from "../../graphql/queries";
import { MessageType, showMessage } from "../../redux/actions";
import LoadingOverlay from "../LoadingOverlay";
import S3Image from "../S3Image";
import { useStyles } from "./AdminNibbleReservationCard.style";
import { AdminNibbleReservationCardProps } from "./AdminNibbleReservationCard.types";

const statusText = (status: NibbleReservationStatus) => {
  switch (status) {
    case NibbleReservationStatus.Completed:
      return "Completed";
    case NibbleReservationStatus.CancelledByRestaurant:
      return "Cancelled by restaurant";
    case NibbleReservationStatus.CancelledByUser:
      return "Cancelled by user";
    case NibbleReservationStatus.Reserved:
      return "Reserved";
    default:
      return "Other";
  }
};

/**
 * Shows an existing reservation for a given Nibble to restaurant admins
 */
const AdminNibbleReservationCard = (props: AdminNibbleReservationCardProps) => {
  const classes = useStyles(props);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();

  const [cancelReservation, { loading: cancelLoading }] = useMutation<
    any,
    MutationAdminCancelReservationArgs
  >(ADMIN_CANCEL_RESERVATION);

  useOutsideClickAlerter([containerRef], () => setHovered(false));
  return (
    <div
      className={classes.container}
      onClick={() => setHovered(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={containerRef}
    >
      <LoadingOverlay show={cancelLoading} />
      <S3Image
        location={props.user.profilePicUrl}
        alt={props.user.name}
        className={classes.profilePic}
      />
      <div className={classes.details}>
        <h3 className={classes.detailsText}>{props.user.name}</h3>
        <h3 className={classes.count}>{props.count}</h3>
        <p className={classes.detailsText}>{props.user.email}</p>
        <p
          className={multipleClasses([classes.detailsText, classes.status])}
        >{`Status: ${statusText(props.status)}`}</p>
        {props.status === NibbleReservationStatus.Reserved ||
        props.status === NibbleReservationStatus.Completed ? (
          <p
            className={multipleClasses([classes.detailsText, classes.status])}
          >{`Reserved: ${moment.unix(props.reservedAt).calendar()}`}</p>
        ) : (
          (props.status === NibbleReservationStatus.CancelledByRestaurant ||
            props.status === NibbleReservationStatus.CancelledByUser) && (
            <p
              className={multipleClasses([classes.detailsText, classes.status])}
            >{`Cancelled: ${moment.unix(props.cancelledAt).calendar()}`}</p>
          )
        )}
      </div>
      {hovered && props.status === NibbleReservationStatus.Reserved && (
        <div className={classes.buttonContainer}>
          {/* <button className={classes.button} id="complete">
            Complete
          </button> */}
          <button
            className={classes.button}
            id="cancel"
            onClick={async () => {
              try {
                await cancelReservation({
                  variables: { nibbleId: props.nibbleId, userId: props.user.userId },
                  refetchQueries: [
                    {
                      query: ADMIN_NIBBLE_RESERVATIONS,
                      variables: { nibbleId: props.nibbleId },
                    },
                  ],
                });
                dispatch(
                  showMessage(
                    "Successfully cancelled reservation",
                    MessageType.Information
                  )
                );
              } catch (err) {
                dispatch(
                  showMessage(
                    `Error cancelling reservation: ${err.message}`,
                    MessageType.Error
                  )
                );
              }
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminNibbleReservationCard;
