import { createUseStyles } from "react-jss";

import { ROW_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  collectionContainer: {
    ...ROW_FLEX_BOX,
    justifyContent: "start",
    alignItems: "start",
    width: "min(95vw, 950px)",
    overflowX: "scroll",
    flexWrap: "wrap",
    // hide scroll bar
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none",
    scrollbarWidth: "none",
    transition: theme.animation.simple,
    margin: "auto",
  },
  "@media (max-width: 620px)": {
    collectionContainer: {
      flexWrap: "nowrap",
      justifyContent: "start",
      width: "100vw",
    },
  },
}));
