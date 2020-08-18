import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  formSection: {
    textAlign: "center",
    width: "90vw",
    maxWidth: 1000,
    background: theme.color.card[0],
    borderRadius: theme.rounding.medium,
    boxShadow: theme.shadow[0],
    margin: ({ margin }) => (margin ? theme.spacing.large : 0),
    padding: ({ padding }) => (padding ? theme.spacing.medium : 0),
    transition: theme.animation.simple,
    "& h3": {
      textAlign: "center",
      margin: theme.spacing.medium,
    },
  },
}));
