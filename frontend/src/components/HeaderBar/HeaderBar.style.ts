import { createUseStyles } from "react-jss";

import { fluidSize } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

const imageSize = fluidSize(36, 2);
const logoWidth = fluidSize(32, 2);

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    position: "fixed",
    top: 0,
    width: "100%",
    height: fluidSize(80),
    background: theme.color.green,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.medium,
    boxSizing: "border-box",
    zIndex: 100,
    borderRadius: `0px 0px ${theme.rounding.medium}px ${theme.rounding.medium}px`,
    boxShadow: theme.shadow[3],
    "& a": {
      height: imageSize,
    },
  },
  logo: {
    width: logoWidth,
    height: imageSize,
    marginRight: theme.spacing.large,
  },
  search: {
    transition: theme.animation.simple,
    marginRight: (searchFocused: boolean) =>
      searchFocused ? `calc(-1 * ${imageSize})` : theme.spacing.large,
    flexGrow: 8,
    maxWidth: (searchFocused: boolean) =>
      searchFocused ? `calc(500px + ${imageSize} + ${theme.spacing.large})` : 500,
    "& h1": {
      textAlign: "center",
      margin: 0,
      lineHeight: 1,
    },
  },
  profilePic: {
    transition: theme.animation.simple,
    position: "relative",
    left: (searchFocused: boolean) =>
      searchFocused ? `calc(${imageSize} + ${theme.spacing.medium})` : 0,
    width: imageSize,
    opacity: (searchFocused: boolean) => (searchFocused ? 0 : 100),
    height: imageSize,
    borderRadius: "50%",
    objectFit: "cover",
  },
  "@media (max-width: 400px)": {
    search: {
      "& h1": {
        fontSize: theme.fontSizes.xLarge,
      },
    },
  },
}));
