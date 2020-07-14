import { AppTheme } from "../types/styles";

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
    },
    card: [
      "#3A3A3A",
      "#595959",
      "#787878",
      "#979797"
    ],
  },
  animation: {
    exciting: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s",
    simple: "all 0.3s ease-in-out 0s",
  },
  spacing: {
    xSmall: 3,
    small: 5,
    medium: 10,
    large: 20,
  },
  rounding: {
    hard: 5,
    medium: 10,
    soft: 40,
  }
};

export const globalTheme = (theme: AppTheme) => ({
  "@global": {
    body: {
      fontFamily: 'Baloo 2'
    },
    "h1 h2": {
      fontFamily: 'Baloo 2'
    },
    "h3 h4 h5 h6": {
      fontFamily: 'Baloo 2'
    },
    a: {
    },
    ul: {
    },
    li: {
    },
    button: {
    },
  },
})

/**
 * Turns a solid color into a transparent color. 
 * @param color hexadecimal string describing color
 * @param transparency value between 0 (invisible) and 1 (opaque)
 */
export const withTransparency = (color: string, transparency: number) => {
  const decTrans = Math.floor(transparency * 255)
  const hexTrans = decTrans.toString(16)
  return `${color}${hexTrans}`
}
