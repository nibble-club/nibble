import React from "react";

import { useStyles } from "./ActionButton.style";
import { ActionButtonProps } from "./ActionButton.types";

const ActionButton = (props: ActionButtonProps) => {
  const classes = useStyles(props);

  return (
    <div className={classes.buttonContainer}>
      <button
        className={classes.button}
        disabled={props.disabled}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </div>
  );
};

export default ActionButton;
