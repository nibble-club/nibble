import { createUseStyles } from "react-jss";

import { ROW_FLEX_BOX, textOutlineShadow } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";
import { getColorForAmount } from "../NibbleCard/NibbleCard.style";

// 0 - 620px: 1 card
// 3 | xx | 3
// 620+px: 2 cards
// 3 | xx | 3 | xx | 3
const featuredCardWidthOneCard = "90vw";
const featuredCardWidthTwoCards = "min(41.5vw, 415px)";
const widthMediaQueries = {
  "@media (max-width: 620px)": {
    container: {
      "--base-width": featuredCardWidthOneCard,
    },
  },
  "@media (min-width: 621px)": {
    container: {
      "--base-width": featuredCardWidthTwoCards,
    },
  },
};
const cardPadding = "min(2vw, 20vw)";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    width: "var(--base-width)",
    height: "calc(3/4 * var(--base-width))",
    margin: "min(3vw, 30px)",
    marginRight: 0,
    position: "relative",
    transition: theme.animation.simple,
    padding: cardPadding,
    backgroundImage: ({ imageUrl }) =>
      `linear-gradient(rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.5) 80%), url(${imageUrl})`,
    backgroundSize: "cover",
    borderRadius: theme.rounding.medium,
    boxShadow: theme.shadow[1],
    "&:hover": {
      boxShadow: theme.shadow[3],
    },
    textShadow: textOutlineShadow(theme),
  },
  image: {
    width: 0,
    height: 0,
    display: "none",
  },
  count: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: theme.spacing.medium,
    lineHeight: 0.8,
    fontSize: theme.fontSizes.xxLarge,
    fontWeight: "bold",
    textShadow: textOutlineShadow(theme),
    color: ({ count }) => getColorForAmount(count, theme),
  },
  properties: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: theme.spacing.medium,
    ...ROW_FLEX_BOX,
    textShadow: "none",
  },
  property: {
    marginRight: theme.spacing.small,
  },
  description: {
    lineHeight: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    margin: theme.spacing.medium,
    "& p": {
      margin: 0,
      marginTop: theme.spacing.small,
      fontWeight: "bold",
    },
    "& #restaurant": {
      color: theme.color.green,
      fontSize: theme.fontSizes.medium,
    },
    "& #name": {
      color: theme.color.text.primary,
      fontSize: theme.fontSizes.xLarge,
    },
  },
  icon: {
    position: "absolute",
    top: 0,
    right: 0,
    color: theme.color.orange,
    "& i": {
      margin: theme.spacing.medium,
      fontSize: 24,
    },
  },
  loading: {
    width: `calc(var(--base-width) + 2 * ${cardPadding})`,
    height: `calc(3/4 * var(--base-width) + 2 * ${cardPadding})`,
    marginLeft: `calc(-1 * (${cardPadding}))`,
    marginTop: `calc(-1 * (${cardPadding}))`,
  },
  ...widthMediaQueries,
}));
