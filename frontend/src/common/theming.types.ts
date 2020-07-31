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
      warn: string;
    };
    /**
     * Represents the card color at 4 elevations; the earliest elevations are the lowest/darkest
     */
    card: [string, string, string, string];
  };
  animation: {
    exciting: string;
    simple: string;
  };
  /**
   * Fluid, changes with viewport width
   */
  fontSizes: {
    xSmall: string;
    small: string;
    medium: string;
    large: string;
    xLarge: string;
    xxLarge: string;
  };
  rounding: {
    hard: number;
    medium: number;
    /**
     * Intended for fully rounded ends (e.g. search box)
     */
    soft: number;
  };
  /**
   * Represents the card shadow at 4 elevations; the earliest elevations are the lowest
   */
  shadow: [string, string, string, string];
  /**
   * Fluid, changes with viewport width
   */
  spacing: {
    xSmall: string;
    small: string;
    medium: string;
    large: string;
  };
  mapboxTheme: string;
  headerHeight: string;
};
