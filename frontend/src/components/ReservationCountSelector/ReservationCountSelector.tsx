import React from "react";

import { useStyles } from "./ReservationCountSelector.style";
import { ReservationCountSelectorProps } from "./ReservationCountSelector.types";

const ReservationCountSelector = (props: ReservationCountSelectorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.buttons}>
        <button
          id="minus"
          onClick={() => {
            props.onCountChange(-1);
          }}
          disabled={props.currentCount <= 1}
        >
          -
        </button>
        <p className={classes.number}>{props.currentCount}</p>
        <button
          id="plus"
          onClick={() => {
            props.onCountChange(1);
          }}
          disabled={props.currentCount >= props.availableCount}
        >
          +
        </button>
      </div>
      <div className={classes.remaining}>{`(${props.availableCount} available)`}</div>
    </div>
  );
};

export default ReservationCountSelector;
