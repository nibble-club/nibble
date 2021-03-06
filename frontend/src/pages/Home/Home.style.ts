import { createUseStyles } from "react-jss";

import { ROW_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  mainContent: {
    marginTop: theme.headerHeight,
  },
  recommendedCollection: {
    ...ROW_FLEX_BOX,
    justifyContent: "start",
    margin: "auto",
    width: "fit-content",
  },
}));
