import { createUseStyles } from "react-jss";

import {
  COLUMN_FLEX_BOX,
  fluidSize,
  ROW_FLEX_BOX,
  withTransparency
} from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";
import { NibbleReservationStatus } from "../../graphql/generated/types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    ...ROW_FLEX_BOX,
    justifyContent: "start",
    position: "relative",
    width: `calc(100% - 2 * ${theme.spacing.medium})`,
    maxWidth: 400,
    margin: theme.spacing.medium,
    backgroundColor: theme.color.card[0],
    borderRadius: theme.rounding.medium,
    padding: theme.spacing.medium,
    boxSizing: "border-box",
    boxShadow: theme.shadow[0],
  },
  profilePic: {
    width: fluidSize(50),
    height: fluidSize(50),
    borderRadius: "50%",
    marginRight: theme.spacing.medium,
  },
  details: {
    ...COLUMN_FLEX_BOX,
    alignItems: "start",
    "& p": {
      fontSize: theme.fontSizes.small,
    },
    width: `calc(100% - ${fluidSize(50)} - ${theme.spacing.medium})`,
  },
  detailsText: {
    margin: theme.spacing.small,
    lineHeight: 1,
    // make ellipsis at end
    width: "100%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  count: {
    color: theme.color.blue,
    position: "absolute",
    top: theme.spacing.medium,
    right: theme.spacing.medium,
    fontSize: theme.fontSizes.xLarge,
    margin: 0,
    lineHeight: 1,
  },
  status: {
    color: ({ status }) =>
      status === NibbleReservationStatus.Completed
        ? theme.color.green
        : status === NibbleReservationStatus.Reserved
        ? theme.color.blue
        : theme.color.text.alert,
    marginBottom: 0,
  },
  buttonContainer: {
    ...ROW_FLEX_BOX,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withTransparency(theme.color.card[1], 0.5),
    borderRadius: theme.rounding.medium,
  },
  button: {
    "&#cancel": {
      backgroundColor: theme.color.text.alert,
    },
    "&#complete": {
      marginRight: 0,
    },
    margin: theme.spacing.large,
    flexGrow: 1,
  },
}));
