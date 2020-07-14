export type AppTheme = {
  // colors
  color: {
    background: string;
    green: string;
    orange: string;
    blue: string;
    pink: string;
    text: {
      primary: string;
      grayed: string;
      alert: string;
    },
    card: [string, string, string, string]
  },
  animation: {
    exciting: string;
    simple: string;
  },
  spacing: {
    xSmall: number;
    small: number;
    medium: number;
    large: number;
  },
  rounding: {
    hard: number;
    medium: number;
    soft: number;
  }
};
