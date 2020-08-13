import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  buttonContainer: {
    position: "fixed",
    right: 0,
    bottom: 0,
    left: 0,
    textAlign: "center",
  },
  button: {
    position: "inline-block",
    marginBottom: theme.spacing.large,
    backgroundColor: ({ color }) => (color ? color : theme.color.green),
    fontSize: theme.fontSizes.xLarge,
    paddingLeft: `calc(1.5 * ${theme.spacing.large})`,
    paddingRight: `calc(1.5 * ${theme.spacing.large})`,
    bottom: theme.spacing.large,
    borderRadius: theme.rounding.soft,
    zIndex: 50,
  },
  "@media (max-width: 620px)": {
    button: {
      width: "100%",
      borderRadius: 0,
      marginBottom: 0,
      padding: theme.spacing.small,
    },
  },
}));
