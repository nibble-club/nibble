import React from "react";

import { useStyles } from "./LabeledInput.style";
import { LabeledInputProps } from "./LabeledInput.types";

/**
 * General input, can put anything on right side using children prop
 */
const LabeledInput = (props: LabeledInputProps) => {
  const classes = useStyles(props);
  return (
    <div className={classes.container}>
      <div className={classes.label}>
        <label>{props.label}</label>
      </div>
      <div className={classes.inputContainer}>{props.children}</div>
    </div>
  );
};

export default LabeledInput;
