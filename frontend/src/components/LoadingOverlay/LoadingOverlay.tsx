import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";

import WithOverlay from "../WithOverlay";
import { useStyles } from "./LoadingOverlay.style";
import { LoadingOverlayProps } from "./LoadingOverlay.types";

/**
 * Displays a loading icon over everything in the next fixed container (normally the
 * entire screen).
 */
const LoadingOverlay = (props: LoadingOverlayProps) => {
  const classes = useStyles();
  return (
    <WithOverlay delay={500} show={props.show} noShadow>
      <CircularProgress
        classes={{
          root: classes.circularProgress,
          svg: classes.circularProgressColor,
        }}
        size={60}
      />
    </WithOverlay>
  );
};

export default LoadingOverlay;
