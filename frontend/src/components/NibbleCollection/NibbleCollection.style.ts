import { createUseStyles } from "react-jss";

import { ROW_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  collectionContainer: {
    ...ROW_FLEX_BOX,
    justifyContent: "start",
    alignItems: "start",
    width: "100%",
    overflowX: "scroll",
    flexWrap: "wrap",
    paddingRight: theme.spacing.small,
    // hide scroll bar
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none",
    scrollbarWidth: "none",
  },
  "@media (max-width: 620px)": {
    collectionContainer: {
      flexWrap: "nowrap",
    },
  },
}));
