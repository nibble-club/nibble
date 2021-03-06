import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming/theming.types";

export const HERO_HEIGHT = "35vh";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    display: "block",
    height: HERO_HEIGHT,
    // marginTop: `-${theme.rounding.medium}px`,
  },
  hero: {
    minHeight: HERO_HEIGHT,
  },
  image: {
    marginTop: ({ imageMargin }) => imageMargin,
    height: ({ imageHeight }) => imageHeight,
  },
  loading: {
    width: "100vw",
    height: HERO_HEIGHT,
  },
}));
