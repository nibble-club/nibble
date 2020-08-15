import { createUseStyles } from "react-jss";

import { COLUMN_FLEX_BOX, ROW_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";
import {
  RESTAURANT_CARD_HEIGHT,
  RESTAURANT_CARD_MARGIN
} from "../../components/RestaurantCard/RestaurantCard.style";

export const MAP_HEIGHT = "45vh";

const DESKTOP_MASTER_WIDTH = `calc(400px + 4 * ${RESTAURANT_CARD_MARGIN}px)`;
const PAGINATION_HEIGHT = `100px`;
const DISTANCE_HEIGHT = `200px`;

export const useStyles = createUseStyles((theme: AppTheme) => ({
  mainContent: {
    marginTop: theme.headerHeight,
  },
  map: {
    position: "fixed",
    top: theme.headerHeight,
    height: MAP_HEIGHT,
    width: "100%",
    zIndex: 20,
  },
  mapDesktop: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: `calc(100% - ${DESKTOP_MASTER_WIDTH})`,
  },
  restaurantList: {
    ...COLUMN_FLEX_BOX,
    marginTop: `calc(${theme.headerHeight} + ${MAP_HEIGHT} + ${theme.spacing.medium})`,
    width: "85vw",
    margin: "auto",
    marginBottom: `calc(-10 * ${theme.spacing.large} + 100vh - ${MAP_HEIGHT} - ${theme.headerHeight} - ${RESTAURANT_CARD_HEIGHT} - ${theme.spacing.medium} - ${PAGINATION_HEIGHT} - ${DISTANCE_HEIGHT})`,
  },
  restaurantListDesktop: {
    marginTop: `calc(${theme.headerHeight} + ${theme.spacing.medium})`,
    width: DESKTOP_MASTER_WIDTH,
    position: "relative",
    marginBottom: `calc(-10 * ${theme.spacing.large} + 100vh - ${theme.headerHeight} - ${RESTAURANT_CARD_HEIGHT} - ${theme.spacing.medium} - ${PAGINATION_HEIGHT} - ${DISTANCE_HEIGHT})`,
  },
  restaurantInnerListDesktop: {
    ...COLUMN_FLEX_BOX,
  },
  paginationContainer: {
    ...COLUMN_FLEX_BOX,
  },
  pagination: {
    ...ROW_FLEX_BOX,
    width: "100%",
    height: PAGINATION_HEIGHT,
    "& button": {
      margin: theme.spacing.large,
      width: `calc(${PAGINATION_HEIGHT} / 2)`,
      height: `calc(${PAGINATION_HEIGHT} / 2)`,
      borderRadius: "50%",
      padding: 0,
    },
  },
  innerButton: {
    ...ROW_FLEX_BOX,
  },
  distance: {
    height: DISTANCE_HEIGHT,
    textAlign: "center",
    "& p": {
      marginTop: theme.spacing.medium,
      marginBottom: `calc(-1 * ${theme.spacing.medium})`,
    },
  },
}));
