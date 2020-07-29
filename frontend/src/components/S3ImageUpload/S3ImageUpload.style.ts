import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    width: "100%",
    minHeight: 100,
    minWidth: 300,
    boxSizing: "border-box",
    background: theme.color.card[0],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.color.text.grayed,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: theme.color.text.grayed,
    padding: theme.spacing.medium,
    textAlign: "center",
    transition: theme.animation.simple,
    "& p": {
      margin: 0,
    },
    "&:hover": {
      borderColor: theme.color.text.primary,
      color: theme.color.text.primary,
    },
  },
}));
