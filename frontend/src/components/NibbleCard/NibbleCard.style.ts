import { createUseStyles } from "react-jss";

import { appTheme } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";
import {
  NibbleAvailableInfoFragment,
  NibbleReservationStatus,
  NibbleReservedInfoFragment
} from "../../graphql/generated/types";

type NibbleCardPropsWithHover = NibbleAvailableInfoFragment &
  NibbleReservedInfoFragment & { isHovered: boolean };

const getColorForAmount = (amount: number) => {
  if (amount <= 1) {
    return appTheme.color.text.alert;
  } else if (amount < 3) {
    return appTheme.color.text.warn;
  } else {
    return appTheme.color.text.primary;
  }
};

const getColorForStatus = (status: NibbleReservationStatus) => {
  switch (status) {
    case NibbleReservationStatus.Reserved:
      return appTheme.color.blue;
    case NibbleReservationStatus.CancelledByRestaurant:
    case NibbleReservationStatus.CancelledByUser:
      return appTheme.color.text.alert;
    default:
      return appTheme.color.text.primary;
  }
};

export const cardWidth = "min(250px, 42vw)";
export const cardPadding = appTheme.spacing.medium;
export const imageWidth = `calc(${cardWidth} + 2 * (${cardPadding}))`;

/**
 * Used in both loading and loaded styles
 */
const commonContainerStyles = (theme: AppTheme) => ({
  width: cardWidth,
  background: theme.color.card[0],
  borderRadius: theme.rounding.medium,
  padding: cardPadding,
  transition: theme.animation.simple,
  margin: theme.spacing.medium,
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
  },
  children: {
    marginTop: theme.spacing.small,
  },
  restaurant: {
    color: theme.color.green,
    fontSize: theme.fontSizes.small,
    fontWeight: "bold",
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
    color: (props: NibbleCardPropsWithHover) => getColorForAmount(props.count),
    fontWeight: "700",
    textShadow: theme.shadow[0],
  },
  pickupBy: {
    paddingTop: theme.spacing.small,
    color: theme.color.text.grayed,
  },
  pickupByTime: {
    color: (props: NibbleCardPropsWithHover) => getColorForStatus(props.status),
    fontSize: theme.fontSizes.large,
    lineHeight: "100%",
    fontWeight: "700",
    maxWidth: `calc(${cardWidth} * 2 / 3)`,
  },
}));

export const useLoadingStyles = createUseStyles((theme: AppTheme) => ({
  loading: {
    ...commonContainerStyles(theme),
    height: `calc(${cardWidth} + 70px)`,
    "& svg": {
      width: imageWidth,
      height: "100%",
      marginLeft: `calc(-1 * (${cardPadding}))`,
      marginTop: `calc(-1 * (${cardPadding}))`,
    },
    boxShadow: (isHovered: boolean) => (isHovered ? theme.shadow[2] : theme.shadow[0]),
  },
}));
