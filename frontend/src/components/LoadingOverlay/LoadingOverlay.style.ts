import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  circularProgress: {
    width: 120,
    height: 120,
    background: theme.color.card[1],
    borderRadius: "50%",
    padding: theme.spacing.small,
    boxShadow: theme.shadow[1],
  },
  circularProgressColor: {
    color: theme.color.pink,
  },
}));
