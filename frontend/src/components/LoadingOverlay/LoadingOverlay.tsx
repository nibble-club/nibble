import React, { useEffect, useRef, useState } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";

import { useStyles } from "./LoadingOverlay.style";
import { LoadingOverlayProps } from "./LoadingOverlay.types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const LoadingOverlay = (props: LoadingOverlayProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [display, setDisplay] = useState(false);
  const [opacity, setOpacity] = useState(false);
  const showOverlay = useRef(() => {
    setDisplay(true);
    delay(500).then(() => {
      if (isMounted) {
        setOpacity(true);
      }
    });
  });

  const hideOverlay = useRef(() => {});

  // avoids memory leaks by preventing state updates after component unmounts
  useEffect(() => {
    setIsMounted(true);

    return () => {
      showOverlay.current = () => {};
      hideOverlay.current = () => {};
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    showOverlay.current = () => {
      setDisplay(true);
      delay(500).then(() => {
        if (isMounted) {
          setOpacity(true);
        }
      });
    };

    hideOverlay.current = () => {
      setOpacity(false);
      delay(500).then(() => {
        if (isMounted) {
          setDisplay(false);
        }
      });
    };
  }, [isMounted]);

  useEffect(() => {
    if (props.show) {
      showOverlay.current();
    } else {
      hideOverlay.current();
    }
  }, [props.show]);

  const classes = useStyles({ opacity, display });
  return (
    <div>
      <div className={classes.overlay}></div>
      <div className={classes.spinner}>
        <CircularProgress
          classes={{
            root: classes.circularProgress,
            svg: classes.circularProgressColor,
          }}
          size={60}
        />
      </div>
    </div>
  );
};

export default LoadingOverlay;
