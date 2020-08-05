import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  menu: {
    transition: theme.animation.simple,
    width: `min(100vw, 1000px)`,
    margin: "auto",
    padding: 0,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    "& button": {
      marginLeft: "min(5vw, 50px)",
      marginTop: theme.spacing.large,
      marginBottom: theme.spacing.large,
      width: "min(42.5vw, 425px)",
    },
  },
}));
