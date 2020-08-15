import { createUseStyles } from "react-jss";

import { COLUMN_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  mainContent: {
    marginTop: theme.headerHeight,
    maxWidth: 1000,
    margin: "auto",
  },
  term: {
    textAlign: "center",
    color: theme.color.text.grayed,
    paddingTop: theme.spacing.small,
    "& p": {
      margin: theme.spacing.medium,
    },
  },
  noResults: {
    color: theme.color.text.grayed,
    margin: theme.spacing.medium,
    marginLeft: `calc(2 * ${theme.spacing.large})`,
  },
  restaurants: {
    ...COLUMN_FLEX_BOX,
    justifyContent: "start",
    margin: theme.spacing.large,
    marginTop: 0,
  },
}));
