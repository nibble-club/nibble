import React, { useEffect, useRef, useState } from "react";

import { useStyles } from "./WithOverlay.style";
import { WithOverlayProps } from "./WithOverlay.types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DEFAULT_DELAY = 100; // ms
/**
 * Displays children in the absolute center of the page, with an overlay obscuring the
 * rest of the page.
 */
const WithOverlay = (props: WithOverlayProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [display, setDisplay] = useState(false);
  const [opacity, setOpacity] = useState(false);
  const showOverlay = useRef(() => {});
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
      delay(props.delay || DEFAULT_DELAY).then(() => {
        if (isMounted) {
          setOpacity(true);
        }
      });
    };

    hideOverlay.current = () => {
      setOpacity(false);
      delay(props.delay || DEFAULT_DELAY).then(() => {
        if (isMounted) {
          setDisplay(false);
        }
      });
    };
  }, [isMounted, props.delay]);

  useEffect(() => {
    if (props.show) {
      showOverlay.current();
    } else {
      hideOverlay.current();
    }
  }, [props.show]);

  const classes = useStyles({
    opacity,
    display,
    noShadow: props.noShadow,
  });
  return (
    <div>
      <div className={classes.overlay}></div>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

export default WithOverlay;
