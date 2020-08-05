import { createUseStyles } from "react-jss";

import { fluidSize } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  mainContent: {
    marginTop: fluidSize(80, 0.1),
  },
}));
