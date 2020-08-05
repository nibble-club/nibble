import { createUseStyles } from "react-jss";

import { fluidSizeProportional } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    width: "100%",
    textAlign: "right",
    display: "flex",
    alignItems: ({ alignLabelTop }) => (alignLabelTop ? "baseline" : "center"),
  },
  imagePreviewContainer: {
    transition: theme.animation.simple,
    margin: theme.spacing.medium,
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",
    justifyContent: "start",
    width: "100%",
  },

  inputContainer: {
    transition: theme.animation.simple,
    margin: theme.spacing.medium,
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",
    justifyContent: "start",
    textAlign: "left",
    width: ({ inputWidth }) => (inputWidth ? `${inputWidth}%` : "fit-content"),
  },
  label: {
    transition: theme.animation.simple,
    fontWeight: "bold",
    width: "30%",
    paddingLeft: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
    lineHeight: 1.1,
    marginLeft: theme.spacing.medium,
  },
  explanation: {
    display: "block",
    fontSize: theme.fontSizes.xSmall,
    color: theme.color.text.grayed,
    marginLeft: theme.spacing.large,
    marginTop: `calc(-1 * ${theme.spacing.small})`,
    margin: 0,
    lineHeight: 1.2,
    marginBottom: theme.spacing.medium,
  },
  errorSpan: {
    display: "block",
    color: theme.color.text.alert,
    paddingLeft: theme.spacing.large,
    marginTop: `calc(-1 * ${theme.spacing.small})`,
    fontSize: theme.fontSizes.small,
    lineHeight: 1.2,
  },
  previewContainer: {
    transition: theme.animation.simple,
    textAlign: "center",
    width: "fit-content",
    background: theme.color.card[1],
    borderRadius: theme.rounding.medium,
    boxShadow: theme.shadow[0],
    padding: theme.spacing.small,
    margin: theme.spacing.medium,
    "& p": {
      margin: theme.spacing.medium,
      marginBottom: 0,
    },
    "& img": {
      margin: theme.spacing.medium,
    },
  },
  imagePreview: {
    width: ({ width }) => fluidSizeProportional(width, 0.9),
    height: ({ height }) => fluidSizeProportional(height, 0.9),
  },
  "@media (max-width: 620px)": {
    container: {
      alignItems: (_) => "baseline",
      textAlign: "left",
      flexDirection: "column",
    },
    inputContainer: {
      width: (_) => "70vw",
    },
    label: {
      width: "100%",
    },
  },
}));
