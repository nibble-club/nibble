import { createUseStyles } from "react-jss";

import { appTheme, withTransparency } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  spinner: {
    display: ({ display }) => (display ? "" : "none"),
    opacity: ({ opacity }) => (opacity ? "100%" : "0%"),
    transition: theme.animation.exciting,
    position: "fixed",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 999,
    overflow: "visible",
    margin: "auto",
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
  circularProgress: {
    width: 120,
    height: 120,
    background: theme.color.card[1],
    borderRadius: "50%",
    padding: theme.spacing.small,
    boxShadow: theme.shadow[1],
  },
  circularProgressColor: {
    color: appTheme.color.pink,
  },
}));
