import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    width: "100%",
    height: 500,
    position: "absolute",
  },
  mapContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    "& .mapboxgl-ctrl-group": {
      background: "none",
      boxShadow: theme.shadow[2],
    },
    "& button.mapboxgl-ctrl-geolocate": {
      backgroundColor: theme.color.card[0],
      transition: theme.animation.simple,
    },
    "& button.mapboxgl-ctrl-geolocate:hover": {
      backgroundColor: theme.color.card[1],
    },
    "& button.mapboxgl-ctrl-geolocate span.mapboxgl-ctrl-icon": {
      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='%23${theme.color.text.primary.replace(
        "#",
        ""
      )}'%3E%3Cpath d='M10 4C9 4 9 5 9 5v.1A5 5 0 005.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 009 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 003.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0011 5.1V5s0-1-1-1zm0 2.5a3.5 3.5 0 110 7 3.5 3.5 0 110-7z'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/svg%3E")`,
    },
    "& .mapboxgl-user-location-dot, .mapboxgl-user-location-dot:before": {
      backgroundColor: theme.color.blue,
    },
  },
  popup: {
    "&.mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip": {
      borderTopColor: theme.color.card[0],
    },
    "&.mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip": {
      borderTopColor: theme.color.card[0],
    },
    "&.mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip": {
      borderBottomColor: theme.color.card[0],
    },
    "&.mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip": {
      borderBottomColor: theme.color.card[0],
    },
    "&.mapboxgl-popup-anchor-left .mapboxgl-popup-tip": {
      borderRightColor: theme.color.card[0],
    },
    "&.mapboxgl-popup-anchor-right .mapboxgl-popup-tip": {
      borderLeftColor: theme.color.card[0],
    },
    "&.mapboxgl-popup-anchor-top .mapboxgl-popup-tip": {
      borderBottomColor: theme.color.card[0],
    },
    "&.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip": {
      borderTopColor: theme.color.card[0],
    },
    "& p": {
      margin: 0,
      fontFamily: '"Baloo 2"',
      fontSize: theme.fontSizes.medium,
    },
    filter: `drop-shadow(${theme.shadow[1]})`,
    "& .mapboxgl-popup-content": {
      background: theme.color.card[0],
      padding: theme.spacing.medium,
    },
  },
  restaurantPopup: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    "& img": {
      width: 30,
      height: 30,
      paddingRight: theme.spacing.medium,
    },
  },
}));
