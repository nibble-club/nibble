import { createUseStyles } from "react-jss";

import { fluidSize } from "../../common/theming";
import { AppTheme } from "../../common/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    width: "100%",
    "& i": {
      position: "absolute",
    },
  },
  input: {
    borderRadius: theme.rounding.soft,
    color: (focused: boolean) =>
      focused ? theme.color.background : theme.color.text.grayed,
    width: "100%",
    boxSizing: "border-box",
    paddingLeft: fluidSize(35, 1),
    // fontSize: theme.fontSizes.medium,
    padding: theme.spacing.small,
    border: "none",
    transition: theme.animation.simple,
    "&:focus": {
      outline: "none",
    },
    boxShadow: (focused: boolean) => (focused ? theme.shadow[0] : ""),
  },
  searchIcon: {
    padding: theme.spacing.small,
    paddingLeft: theme.spacing.medium,
    // minWidth: 40,
    color: (focused: boolean) =>
      focused ? theme.color.background : theme.color.text.grayed,
    fontSize: theme.fontSizes.large,
    transition: theme.animation.simple,
    lineHeight: 1.35,
  },
}));
