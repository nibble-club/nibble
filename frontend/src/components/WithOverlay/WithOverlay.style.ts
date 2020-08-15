import { createUseStyles } from "react-jss";

import { withTransparency } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  content: {
    display: ({ display }) => (display ? "" : "none"),
    opacity: ({ opacity }) => (opacity ? "100%" : "0%"),
    transition: theme.animation.exciting,
    position: "fixed",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    height: "fit-content",
    width: "fit-content",
    zIndex: 99,
    overflow: "visible",
    margin: "auto",
    boxShadow: theme.shadow[3],
  },
  overlay: {
    display: ({ display }) => (display ? "block" : "none"),
    opacity: ({ opacity }) => (opacity ? "100%" : "0%"),
    transition: theme.animation.simple,
    position: "fixed",
    width: "100%",
    height: "100%",
    backgroundColor: withTransparency(theme.color.background, 0.6),
    zIndex: 98,
    left: 0,
    top: 0,
  },
}));
