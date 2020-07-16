import { AppTheme } from "./theming.types";

const fluidSize = (baseSize: number, ratio = 1) => {
  return `calc(${baseSize}px + ${ratio} * 1vw)`;
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
    xSmall: fluidSize(10),
    small: fluidSize(12),
    medium: fluidSize(16),
    large: fluidSize(20),
    xLarge: fluidSize(24),
    xxLarge: fluidSize(36),
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
};

export const globalTheme = (theme: AppTheme) => ({
  "@global": {
    body: {
      fontFamily: "Baloo 2",
    },
    "h1 h2": {
      fontFamily: "Baloo 2",
    },
    "h3 h4 h5 h6": {
      fontFamily: "Baloo 2",
    },
    a: {},
    ul: {},
    li: {},
    button: {},
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
