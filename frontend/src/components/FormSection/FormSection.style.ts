import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  formSection: {
    textAlign: "center",
    width: `min(90vw, 1000px)`,
    background: theme.color.card[0],
    borderRadius: theme.rounding.medium,
    boxShadow: theme.shadow[0],
    margin: theme.spacing.large,
    transition: theme.animation.simple,
    "& h3": {
      textAlign: "center",
      margin: theme.spacing.medium,
    },
  },
}));
