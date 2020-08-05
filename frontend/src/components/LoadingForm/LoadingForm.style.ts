import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  loading: {
    width: `min(90vw, 1000px)`,
    margin: theme.spacing.large,
    background: theme.color.card[0],
    height: 500,
    borderRadius: theme.rounding.medium,
    boxShadow: theme.shadow[0],
    "& svg": {
      width: "100%",
      height: "100%",
      padding: theme.spacing.large,
      boxSizing: "border-box",
    },
  },
}));
