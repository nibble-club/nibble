import { createUseStyles } from "react-jss";

import { COLUMN_FLEX_BOX, ROW_FLEX_BOX } from "../../common/theming/theming";
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
  reservationsContainer: {
    ...formOuterContainerStyles(theme),
    "& button": {},
  },
  reservations: {
    ...ROW_FLEX_BOX,
    flexWrap: "wrap",
    width: "90vw",
    maxWidth: 1000,
  },
  ...selectStyles(theme),
}));
