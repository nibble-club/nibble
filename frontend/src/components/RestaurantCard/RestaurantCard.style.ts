import { createUseStyles } from "react-jss";

import { fluidSize } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const RESTAURANT_CARD_HEIGHT = fluidSize(90, 5);

export const cardPadding = (theme: AppTheme) => theme.spacing.medium;
export const RESTAURANT_CARD_MARGIN = 15;

export const useStyles = createUseStyles((theme: AppTheme) => ({
  link: {
    position: "relative",
    width: "100%",
    maxWidth: 400,
    margin: RESTAURANT_CARD_MARGIN, // need to use predictable value
    marginBottom: 0,
  },
  container: {
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: theme.color.card[0],
    borderRadius: theme.rounding.medium,
    padding: cardPadding(theme),
    position: "relative",
    height: RESTAURANT_CARD_HEIGHT,
    boxShadow: theme.shadow[0],
    "&:hover": {
      boxShadow: theme.shadow[2],
    },
    transition: theme.animation.simple,
  },
  overflowContainer: {
    width: `calc(100% - ${RESTAURANT_CARD_HEIGHT})`,
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
    color: theme.color.text.grayed,

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
    height: RESTAURANT_CARD_HEIGHT,
    width: RESTAURANT_CARD_HEIGHT,
    position: "absolute",
    right: 0,
    top: 0,
    borderRadius: `0px ${theme.rounding.medium}px ${theme.rounding.medium}px 0px`,
    transition: theme.animation.simple,
  },
  loading: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: RESTAURANT_CARD_HEIGHT,
  },
  loadingPicture: {
    x: `calc(100% - ${RESTAURANT_CARD_HEIGHT})`,
    y: 0,
    width: RESTAURANT_CARD_HEIGHT,
    height: RESTAURANT_CARD_HEIGHT,
  },
}));
