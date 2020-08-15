import { createUseStyles } from "react-jss";

import { COLUMN_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    ...COLUMN_FLEX_BOX,
    minWidth: 250,
    maxWidth: 500,
    minHeight: 100,
    padding: `calc(2 * ${theme.spacing.large})`,
  },
}));
