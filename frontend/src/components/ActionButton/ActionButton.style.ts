import { createUseStyles } from "react-jss";

import { ROW_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  buttonContainer: {
    ...ROW_FLEX_BOX,
    position: "fixed",
    right: 0,
    bottom: 0,
    left: 0,
    textAlign: "center",
    zIndex: 50,
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
