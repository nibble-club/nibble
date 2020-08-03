import moment from "moment";
import React, { useState } from "react";

import {
  NibbleReservationStatus,
  NibbleReservedInfoFragment
} from "../../graphql/generated/types";
import S3Image from "../S3Image";
import { useStyles } from "./NibbleCard.style";

export const NibbleCardReserved = (props: NibbleReservedInfoFragment) => {
  const [isHovered, setIsHovered] = useState(false);
  const classes = useStyles({ isHovered, ...props });

  return (
    <div
      className={classes.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <S3Image className={classes.image} location={props.imageUrl} alt={props.name} />
      </div>
      <div className={classes.restaurant}>{props.restaurant.name}</div>
      <div className={classes.name}>{props.name}</div>
      <div>
        {props.status === NibbleReservationStatus.Completed ||
        moment().isAfter(moment.unix(props.availableTo)) ? (
          <div>
            <div className={classes.pickupBy}>Ordered:</div>
            <div className={classes.pickupByTime}>
              {moment.unix(props.reservedAt).fromNow()}
            </div>
          </div>
        ) : props.status === NibbleReservationStatus.Reserved ? (
          <div>
            <div className={classes.pickupBy}>Pickup by:</div>
            <div className={classes.pickupByTime}>
              {moment.unix(props.availableTo).calendar()}
            </div>
          </div>
        ) : (
          // cancelled
          <div>
            <div className={classes.pickupBy}>Cancelled:</div>
            <div className={classes.pickupByTime}>
              {moment.unix(props.cancelledAt || moment().unix()).calendar()}
            </div>{" "}
          </div>
        )}
        <div className={classes.remaining}>{props.count}</div>
      </div>
    </div>
  );
};
