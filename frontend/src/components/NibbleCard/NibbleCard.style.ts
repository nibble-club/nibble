import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming/theming.types";
import {
  NibbleAvailableInfoFragment,
  NibbleReservationStatus,
  NibbleReservedInfoFragment
} from "../../graphql/generated/types";

type NibbleCardPropsWithHover = NibbleAvailableInfoFragment &
  NibbleReservedInfoFragment & { isHovered: boolean };

export const getColorForAmount = (amount: number, theme: AppTheme) => {
  if (amount <= 1) {
    return theme.color.text.alert;
  } else if (amount <= 3) {
    return theme.color.text.warn;
  } else {
    return theme.color.text.primary;
  }
};

const getColorForStatus = (status: NibbleReservationStatus, theme: AppTheme) => {
  switch (status) {
    case NibbleReservationStatus.Reserved:
      return theme.color.blue;
    case NibbleReservationStatus.CancelledByRestaurant:
    case NibbleReservationStatus.CancelledByUser:
      return theme.color.text.alert;
    default:
      return theme.color.text.primary;
  }
};

// 0-620px: 2 cards
// 2 |     xx      | 2 |     xx      | 2
// 620-1000px: 3 cards
// 2 |  xx   | 2 |  xx   | 2 |  xx   | 2
// 1000+px: 4 cards
// 2 | xx | 2 | xx | 2 | xx | 2 | xx | 2
export const cardWidthTwoCards = "42.5vw";
export const cardWidthThreeCards = "27vw";
export const cardWidthFourCards = "min(19.25vw, 192.5px)";
export const cardPadding = "min(1.5vw, 15px)";
export const imageWidth = `calc(var(--base-width) + 2 * (${cardPadding}))`;

const widthMediaQueries = {
  "@media (max-width: 620px)": {
    container: {
      "--base-width": cardWidthTwoCards,
    },
  },
  "@media (min-width: 621px) and (max-width: 1000px)": {
    container: {
      "--base-width": cardWidthThreeCards,
    },
  },
  "@media (min-width: 1001px)": {
    container: {
      "--base-width": cardWidthFourCards,
    },
  },
};

/**
 * Used in both loading and loaded styles
 */
const commonContainerStyles = (theme: AppTheme) => ({
  width: "var(--base-width)",
  background: theme.color.card[0],
  borderRadius: theme.rounding.medium,
  padding: cardPadding,
  transition: theme.animation.simple,
  margin: cardPadding,
  marginRight: 0,
});

export const useStyles = createUseStyles((theme: AppTheme) => ({
  loadingContainer: {
    width: "fit-content",
  },
  container: {
    ...commonContainerStyles(theme),
    display: "flex",
    flexDirection: "column",
    position: "relative",
    boxShadow: (props: NibbleCardPropsWithHover) =>
      props.isHovered ? theme.shadow[2] : theme.shadow[0],
  },
  image: {
    width: imageWidth,
    height: `calc(2/3 * ${imageWidth})`,
    marginLeft: `calc(-1 * (${cardPadding}))`,
    marginTop: `calc(-1 * (${cardPadding}))`,
    borderRadius: `${theme.rounding.medium}px ${theme.rounding.medium}px 0px 0px`,
    objectFit: "cover",
    transition: theme.animation.simple,
  },
  restaurant: {
    color: theme.color.green,
    fontSize: theme.fontSizes.small,
    fontWeight: "bold",
    lineHeight: 1.1,
  },
  name: {
    color: theme.color.text.primary,
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
    lineHeight: "100%",
    paddingBottom: theme.spacing.small,
  },
  remaining: {
    position: "absolute",
    right: cardPadding,
    bottom: cardPadding,
    fontSize: theme.fontSizes.xLarge,
    lineHeight: "100%",
    color: (props: NibbleCardPropsWithHover) => getColorForAmount(props.count, theme),
    fontWeight: "700",
    textShadow: theme.shadow[0],
    "&#reserved": {
      color: (_) => theme.color.green,
    },
  },
  pickupBy: {
    paddingTop: theme.spacing.small,
    color: theme.color.text.grayed,
    fontSize: theme.fontSizes.small,
  },
  pickupByTime: {
    color: (props: NibbleCardPropsWithHover) => getColorForStatus(props.status, theme),
    fontSize: theme.fontSizes.large,
    lineHeight: "100%",
    fontWeight: "700",
    maxWidth: `calc(var(--base-width) * 2 / 3)`,
  },
  ...widthMediaQueries,
}));

export const useLoadingStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    ...commonContainerStyles(theme),
    height: 320,
    "& svg": {
      width: imageWidth,
      height: "100%",
      marginLeft: `calc(-1 * (${cardPadding}))`,
      marginTop: `calc(-1 * (${cardPadding}))`,
    },
    boxShadow: (isHovered: boolean) => (isHovered ? theme.shadow[2] : theme.shadow[0]),
  },
  ...widthMediaQueries,
}));
