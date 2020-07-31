import { createUseStyles } from "react-jss";

import { fluidSize } from "../../common/theming";
import { AppTheme } from "../../common/theming.types";

const formBoxStyles = (theme: AppTheme) => ({
  textAlign: "center",
  width: `min(90vw, 1000px)`,
  background: theme.color.card[0],
  borderRadius: theme.rounding.medium,
  boxShadow: theme.shadow[0],
  // padding: theme.spacing.large,
  margin: theme.spacing.large,
  transition: theme.animation.simple,
});

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& h2": {
      textAlign: "center",
      fontSize: theme.fontSizes.xLarge,
      margin: theme.spacing.large,
      lineHeight: 1.2,
    },
    "& h3": {
      textAlign: "center",
      margin: theme.spacing.medium,
    },
    "& span": {
      display: "block",
      color: theme.color.text.alert,
      paddingLeft: theme.spacing.large,
      marginTop: `calc(-1 * ${theme.spacing.small})`,
      fontSize: theme.fontSizes.small,
    },
    "& button": {
      width: "fit-content",
      paddingLeft: theme.spacing.large,
      paddingRight: theme.spacing.large,
      margin: theme.spacing.large,
      marginBottom: `calc(2 * ${theme.spacing.large})`,
    },
    "& #form-error": {
      maxWidth: 500,
      textAlign: "center",
    },
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  restaurantInfoForm: {
    ...formBoxStyles(theme),
  },
  brandingForm: {
    ...formBoxStyles(theme),
    "& div": {
      alignItems: "baseline",
    },
  },
  addressForm: {
    ...formBoxStyles(theme),
  },
  imagePreviewContainer: {
    transition: theme.animation.simple,
    margin: theme.spacing.medium,
    "& #s3-image-upload": {
      margin: theme.spacing.medium,
      alignItems: "center",
      width: fluidSize(250, 10),
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",
    justifyContent: "start",
    width: "100%",
  },
  mapViewContainer: {
    position: "relative",
    // width: "80%",
    height: 500,
    // boxShadow: theme.shadow[0],
  },
  select: {
    margin: theme.spacing.medium,
  },
  selectActive: {
    margin: theme.spacing.medium,
    borderBottom: `1px solid ${theme.color.text.primary}`,
  },
  explanation: {
    display: "block",
    fontSize: theme.fontSizes.xSmall,
    color: theme.color.text.grayed,
    marginLeft: theme.spacing.large,
    marginTop: `calc(-1 * ${theme.spacing.small})`,
    margin: 0,
    marginBottom: theme.spacing.medium,
  },
  previewContainer: {
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
  logoPreview: {
    width: fluidSize(100, 4),
    height: fluidSize(100, 4),
  },
  heroPreview: {
    width: fluidSize(225, 10),
    height: fluidSize(150, 10),
  },
  loading: {
    width: `min(90vw, 1000px)`,
    margin: theme.spacing.large,
    background: theme.color.card[0],
    height: 500,
    borderRadius: theme.rounding.medium,
    boxShadow: theme.shadow[0],
    "& svg": {
      width: "100%",
      height: "100%",
      padding: theme.spacing.large,
      boxSizing: "border-box",
    },
  },
  "@media (max-width: 620px)": {
    imagePreviewContainer: {
      flexDirection: "column",
    },
  },
}));
