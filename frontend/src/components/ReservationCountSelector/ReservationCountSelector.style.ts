import { createUseStyles } from "react-jss";

import { COLUMN_FLEX_BOX, fluidSize, ROW_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

const disabledButtonStyle = (theme: AppTheme) => ({
  background: theme.color.text.grayed,
  color: theme.color.text.primary,
});

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    ...COLUMN_FLEX_BOX,
  },
  buttons: {
    ...ROW_FLEX_BOX,
    "& button": {
      borderRadius: "50%",
      width: fluidSize(40, 5),
      height: fluidSize(40, 5),
      margin: theme.spacing.large,
      fontSize: `calc(2 * ${theme.fontSizes.xLarge})`,
      fontWeight: "bold",
      lineHeight: 0,
      "&:focus": {
        outline: 0,
        boxShadow: `0 0 0 1px ${theme.color.text.primary}`,
      },
    },
    "& #minus": {
      background: theme.color.text.alert,
      marginRight: `calc(2 * ${theme.spacing.large})`,
      "&:disabled": {
        ...disabledButtonStyle(theme),
      },
    },
    "& #plus": {
      background: theme.color.green,
      marginLeft: `calc(2 * ${theme.spacing.large})`,
      "&:disabled": {
        ...disabledButtonStyle(theme),
      },
    },
  },
  number: {
    fontSize: `calc(1.5 * ${theme.fontSizes.xLarge})`,
    margin: theme.spacing.medium,
    fontWeight: "bold",
    lineHeight: 1,
    width: fluidSize(50),
    textAlign: "center",
  },
  remaining: {
    color: theme.color.text.grayed,
    fontSize: theme.fontSizes.small,
    marginTop: `calc(-1.8 * ${theme.spacing.large})`,
  },
  "@media (max-width: 620px)": {
    buttons: {
      "& #minus": {
        marginRight: theme.spacing.large,
      },
      "& #plus": {
        marginLeft: theme.spacing.large,
      },
    },
    remaining: {
      marginTop: `calc(-1.2 * ${theme.spacing.large})`,
    },
  },
}));
