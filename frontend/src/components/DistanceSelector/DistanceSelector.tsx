import React from "react";

import Slider from "@material-ui/core/Slider";

import { useStyles } from "./DistanceSelector.style";
import { DistanceSelectorProps } from "./DistanceSelector.types";

const DEFAULT_DISTANCE = 2;

const DistanceSelector = (props: DistanceSelectorProps) => {
  const classes = useStyles();
  const min = props.min || 0.1;
  const max = props.max;

  return (
    <div className={classes.container}>
      <Slider
        defaultValue={props.startValue || DEFAULT_DISTANCE}
        step={0.1}
        min={min}
        max={max}
        valueLabelDisplay="on"
        marks={[
          { value: min, label: `${min} mile${min === 1 ? "" : "s"}` },
          { value: max, label: `${max} mile${max === 1 ? "" : "s"}` },
        ]}
        onChangeCommitted={(event, value) =>
          props.onDistanceChange(typeof value === "number" ? value : value[0])
        }
      />
    </div>
  );
};

export default DistanceSelector;
