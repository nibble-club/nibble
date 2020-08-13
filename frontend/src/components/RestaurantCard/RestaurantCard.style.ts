import { createUseStyles } from "react-jss";

import { fluidSize } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

const HEIGHT = fluidSize(90, 5);

const cardPadding = (theme: AppTheme) => theme.spacing.medium;

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    maxWidth: 400,
    backgroundColor: theme.color.card[0],
    borderRadius: theme.rounding.medium,
    padding: cardPadding(theme),
    position: "relative",
    height: `calc(${HEIGHT} - 2 * ${cardPadding(theme)})`,
    boxShadow: theme.shadow[0],
    "&:hover": {
      boxShadow: theme.shadow[2],
    },
    transition: theme.animation.simple,
    margin: theme.spacing.medium,
    marginBottom: 0,
  },
  overflowContainer: {
    width: `calc(100% - ${HEIGHT})`,
  },
  name: {
    color: theme.color.green,
    lineHeight: 1,
    height: "1em",
    margin: 0,
    marginBottom: theme.spacing.small,
    width: "100%",

    // make ellipsis at end
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  address: {
    lineHeight: 1.1,
    height: "1em",
    margin: 0,
    fontSize: theme.fontSizes.small,
    width: "100%",

    // make ellipsis at end
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  propertiesContainer: {
    position: "absolute",
    bottom: cardPadding(theme),
    left: cardPadding(theme),
  },
  logo: {
    height: HEIGHT,
    width: HEIGHT,
    position: "absolute",
    right: 0,
    top: 0,
    borderRadius: `0px ${theme.rounding.medium}px ${theme.rounding.medium}px 0px`,
    transition: theme.animation.simple,
  },
}));
