import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  mainContent: {
    position: "relative",
    top: theme.headerHeight,
    display: "block",
    width: "100%",
  },
}));
