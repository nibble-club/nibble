import { createUseStyles } from "react-jss";

import { COLUMN_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";
import {
  formOuterContainerStyles,
  selectStyles
} from "../AdminEditRestaurant/AdminEditRestaurant.style";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    ...formOuterContainerStyles(theme),
  },
  formContainer: {
    ...COLUMN_FLEX_BOX,
  },
  ...selectStyles(theme),
}));
