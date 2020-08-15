import { createUseStyles } from "react-jss";

import { COLUMN_FLEX_BOX, ROW_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  mainContent: {},
  fixedContainer: {
    maxWidth: 1000,
    margin: "auto",
  },
  detailsContainer: {
    ...COLUMN_FLEX_BOX,
    alignItems: "start",
    "& h1": {
      margin: theme.spacing.large,
      marginBottom: 0,
      lineHeight: 1.1,
    },
  },
  priceNameContainer: {
    ...ROW_FLEX_BOX,
    marginBottom: theme.spacing.medium,
    "& h3": {
      marginLeft: theme.spacing.large,
      margin: 0,
    },
    "& #price": {
      color: theme.color.green,
    },
    "& #restaurant": {
      marginLeft: theme.spacing.medium,
      color: theme.color.pink,
      lineHeight: 1,
    },
    "& #separator": {
      margin: 0,
      marginTop: `calc(-1 * ${theme.spacing.xSmall})`,
      marginLeft: theme.spacing.medium,
      color: theme.color.text.grayed,
      fontSize: theme.fontSizes.xLarge,
    },
  },
  description: {
    margin: theme.spacing.large,
    lineHeight: 1.2,
  },
  properties: {
    ...ROW_FLEX_BOX,
    justifyContent: "start",
    flexWrap: "wrap",
    marginLeft: theme.spacing.large,
  },
  reservationContainer: {
    ...COLUMN_FLEX_BOX,
    textAlign: "center",
    marginBottom: theme.spacing.large,
  },
  buttonContainer: {
    position: "fixed",
    right: 0,
    bottom: 0,
    left: 0,
    textAlign: "center",
  },
  reserveButton: {
    position: "inline-block",
    marginBottom: theme.spacing.large,
    backgroundColor: theme.color.green,
    fontSize: theme.fontSizes.xLarge,
    paddingLeft: `calc(1.5 * ${theme.spacing.large})`,
    paddingRight: `calc(1.5 * ${theme.spacing.large})`,
    bottom: theme.spacing.large,
    borderRadius: theme.rounding.soft,
    zIndex: 50,
  },
  "@media (max-width: 620px)": {
    reserveButton: {
      width: "100%",
      borderRadius: 0,
      marginBottom: 0,
      padding: theme.spacing.small,
    },
  },
}));
