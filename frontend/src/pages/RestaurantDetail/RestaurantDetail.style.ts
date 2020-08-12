import { createUseStyles } from "react-jss";

import { ROW_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  mainContent: {},
  fixedContainer: {
    maxWidth: 1000,
    margin: "auto",
  },
  detailsContainer: {
    marginLeft: theme.spacing.large,
    marginRight: theme.spacing.large,
  },
  name: {
    margin: 0,
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.medium,
    color: theme.color.green,
    lineHeight: 1,
  },
  addressContainer: {
    ...ROW_FLEX_BOX,
  },
  address: {
    flexGrow: 1,
    "& h3": {
      margin: 0,
      lineHeight: 1.1,
      fontSize: theme.fontSizes.medium,
      marginBottom: theme.spacing.small,
    },
  },
  navigate: {
    color: theme.color.blue,
    textAlign: "center",
    borderLeft: `1px solid ${theme.color.text.grayed}`,
    paddingLeft: theme.spacing.large,
    marginLeft: theme.spacing.large,
    "& p": {
      margin: 0,
      lineHeight: 1,
    },
    "& i": {
      fontSize: 36,
    },

    flexGrow: 0,
  },
  description: {
    lineHeight: 1.45,
  },
  nibbleCollection: {
    marginBottom: theme.spacing.large,
  },
  disclaimer: {
    color: theme.color.text.grayed,
    fontSize: theme.fontSizes.small,
    marginLeft: theme.spacing.large,
  },
}));
