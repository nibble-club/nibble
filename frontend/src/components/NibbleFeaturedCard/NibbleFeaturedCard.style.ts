import { createUseStyles } from "react-jss";

import { ROW_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";
import { cardWidth, getColorForAmount } from "../NibbleCard/NibbleCard.style";

const offset = "3px";
const blur = "6px";
const textOutlineShadow = (
  theme: AppTheme
) => `-${offset} ${offset} ${blur} ${theme.color.background}, 
${offset} ${offset} ${blur} ${theme.color.background}, 
${offset} -${offset} ${blur} ${theme.color.background}, 
-${offset} -${offset} ${blur} ${theme.color.background}`;
const featuredCardWidth = `calc(2 * ${cardWidth})`;
export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    width: featuredCardWidth,
    height: `calc(3/4 * ${featuredCardWidth})`,
    margin: theme.spacing.medium,
    position: "relative",
    transition: theme.animation.simple,
    padding: theme.spacing.medium,
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
    // textShadow: textOutlineShadow(theme),
    color: ({ count }) => getColorForAmount(count, theme),
  },
  properties: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: theme.spacing.medium,
    ...ROW_FLEX_BOX,
  },
  property: {
    marginRight: theme.spacing.small,
    boxShadow: theme.shadow[1],
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
}));
