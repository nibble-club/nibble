import { relative } from "path";
import { createUseStyles } from "react-jss";

import { fluidSize } from "../../common/theming";
import { AppTheme } from "../../common/theming.types";

const imageSize = fluidSize(36, 2);
const logoWidth = fluidSize(32, 2);

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    position: "fixed",
    top: 0,
    width: "100%",
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
}));
