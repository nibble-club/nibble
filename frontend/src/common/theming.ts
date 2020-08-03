import { createMuiTheme } from "@material-ui/core";

import { AppTheme } from "./theming.types";

export const fluidSize = (baseSize: number, ratio = 1) => {
  return `calc(${baseSize}px + ${ratio} * min(1vw, 10px))`;
};

export const fluidFontSize = (baseSize: number, ratio = 1) => {
  return `calc(${baseSize / 16}rem + ${ratio} * min(1vw, 10px))`;
};

export const fluidSizeProportional = (baseSize: number, ratio = 1) => {
  return `min(calc(${(ratio * baseSize) / 4}vw), ${(ratio * baseSize) / 4} * 10px)`;
};

export const appTheme: AppTheme = {
  color: {
    background: "#222222",
    green: "#7FCA64",
    orange: "#FFBA49",
    blue: "#00C2D1",
    pink: "#F06C9B",
    text: {
      primary: "#FFFFFF",
      grayed: "#888888",
      alert: "#FF6D6D",
      warn: "#FFB627",
    },
    card: ["#3A3A3A", "#595959", "#787878", "#979797"],
  },
  animation: {
    exciting: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s",
    simple: "all 0.3s ease-in-out 0s",
  },
  fontSizes: {
    xSmall: fluidFontSize(10),
    small: fluidFontSize(12),
    medium: fluidFontSize(16),
    large: fluidFontSize(20),
    xLarge: fluidFontSize(24),
    xxLarge: fluidFontSize(36),
  },
  spacing: {
    xSmall: fluidSize(3, 0.1),
    small: fluidSize(5, 0.1),
    medium: fluidSize(10, 0.1),
    large: fluidSize(20, 0.1),
  },
  rounding: {
    hard: 5,
    medium: 10,
    soft: 100,
  },
  shadow: [
    "0px 0px 8px rgba(0, 0, 0, 0.25)",
    "0px 0px 16px rgba(0, 0, 0, 0.25)",
    "0px 0px 24px rgba(0, 0, 0, 0.25)",
    "0px 0px 32px rgba(0, 0, 0, 0.25)",
  ],
  mapboxTheme: "mapbox://styles/mapbox/dark-v10",
  headerHeight: fluidSize(80),
};

export const globalTheme = (theme: AppTheme) => ({
  "@global": {
    html: {
      backgroundColor: theme.color.background,
    },
    body: {
      margin: 0,
      padding: 0,
      fontFamily: '"Baloo 2"',
      color: theme.color.text.primary,
      fontSize: theme.fontSizes.medium,
    },
    "h1, h2": {
      fontFamily: '"Baloo 2"',
      color: theme.color.text.primary,
      fontSize: theme.fontSizes.xxLarge,
      margin: theme.spacing.large,
    },
    "h3, h4, h5, h6": {
      fontFamily: '"Baloo 2"',
      color: theme.color.text.primary,
      fontSize: theme.fontSizes.large,
    },
    input: {
      fontFamily: '"Baloo 2"',
      fontSize: theme.fontSizes.medium,
    },
    select: {
      fontFamily: '"Baloo 2"',
      fontSize: theme.fontSizes.medium,
      backgroundColor: theme.color.card[0],
      border: 0,
      borderBottom: `1px solid ${theme.color.text.grayed}`,
      paddingLeft: theme.spacing.small,
      paddingRight: theme.spacing.small,
      color: theme.color.text.primary,
      "&:focus": {
        // outline: "none",
      },
    },
    a: {
      textDecoration: "none",
    },
    ul: {},
    li: {},
    button: {
      fontFamily: '"Baloo 2"',
      fontSize: theme.fontSizes.medium,
      border: "none",
      textDecoration: "none",
      color: theme.color.text.primary,
      background: theme.color.blue,
      padding: theme.spacing.xSmall,
      paddingLeft: theme.spacing.medium,
      paddingRight: theme.spacing.medium,
      borderRadius: theme.rounding.hard,
      transition: theme.animation.simple,
      cursor: "pointer",
      "&:disabled": {
        background: theme.color.card[1],
        color: theme.color.text.grayed,
        cursor: "default",
      },
      "&:hover": {
        boxShadow: theme.shadow[1],
      },
    },
  },
});

/**
 * Turns a solid color into a transparent color.
 * @param color hexadecimal string describing color
 * @param transparency value between 0 (invisible) and 1 (opaque)
 */
export const withTransparency = (color: string, transparency: number) => {
  const decTrans = Math.floor(transparency * 255);
  const hexTrans = decTrans.toString(16);
  return `${color}${hexTrans}`;
};

export const multipleClasses = (classes: Array<string>) => {
  return classes.join(" ");
};

export const COLUMN_FLEX_BOX = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

export const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: appTheme.color.blue,
    },
    secondary: {
      main: appTheme.color.green,
    },
    error: {
      main: appTheme.color.text.alert,
    },
    warning: {
      main: appTheme.color.text.warn,
    },
    text: {
      primary: appTheme.color.text.primary,
      disabled: appTheme.color.text.grayed,
    },
    background: {
      paper: appTheme.color.card[0],
      default: appTheme.color.background,
    },
    type: "dark",
  },
  typography: {
    fontFamily: '"Baloo 2"',
  },
});
