import React from "react";

import { useStyles } from "./ReservationCountSelector.style";
import { ReservationCountSelectorProps } from "./ReservationCountSelector.types";

const ReservationCountSelector = (props: ReservationCountSelectorProps) => {
  const classes = useStyles(props.currentCount);

  return (
    <div className={classes.container}>
      <div className={classes.buttons}>
        <button id="minus">-</button>
        <p className={classes.number}>{props.currentCount}</p>
        <button id="plus">+</button>
      </div>
      <div className={classes.remaining}>{`(${props.availableCount} available)`}</div>
    </div>
  );
};

export default ReservationCountSelector;
