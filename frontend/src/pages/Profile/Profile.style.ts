import { createUseStyles } from "react-jss";

import {
  COLUMN_FLEX_BOX,
  fluidFontSize,
  fluidSize,
  ROW_FLEX_BOX,
  textOutlineShadow,
  withTransparency
} from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

const ATTRIBUTION_HEIGHT = 100;

export const useStyles = createUseStyles((theme: AppTheme) => ({
  mainContent: {
    ...COLUMN_FLEX_BOX,
    justifyContent: "start",
    backgroundColor: theme.color.green,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: "fit-content",
    minHeight: "100%",
    textShadow: textOutlineShadow(theme, 0.2),
    paddingBottom: `calc(${theme.spacing.large} + ${ATTRIBUTION_HEIGHT}px)`,
  },
  title: {
    ...COLUMN_FLEX_BOX,
    margin: theme.spacing.large,
    "& h3": {
      margin: theme.spacing.small,
      marginTop: `calc(-1 * ${theme.spacing.medium})`,
    },
  },
  nibbleLogoLink: {
    width: fluidSize(200, 5),
    textAlign: "center",
  },
  nibbleLogo: {
    width: "100%",
    filter: `drop-shadow(${theme.shadow[2]})`,
  },
  userInfo: {
    ...ROW_FLEX_BOX,
    flexWrap: "wrap-reverse",
    marginBottom: `calc(${theme.spacing.large} * 3)`,
  },
  userInfoText: {
    ...COLUMN_FLEX_BOX,
    flexGrow: 1,
    maxWidth: 500,
    margin: theme.spacing.medium,
    "& h2": {
      fontSize: theme.fontSizes.xLarge,
      margin: theme.spacing.medium,
      lineHeight: 1,
    },
    "& p": {
      color: theme.color.text.primary,
      margin: theme.spacing.medium,
      marginTop: 0,
      lineHeight: 1.1,
      fontSize: theme.fontSizes.small,
    },
  },
  profilePictureContainer: {
    ...COLUMN_FLEX_BOX,
    flexGrow: 0,
    justifyContent: "start",
    width: fluidSize(150),
    height: fluidSize(150),
    margin: theme.spacing.medium,
  },
  helperText: {
    fontSize: fluidFontSize(6),
    color: theme.color.text.primary,
    margin: 0,
    lineHeight: 1.2,
    textAlign: "center",
  },
  profilePicture: {
    borderRadius: "50%",
    filter: `drop-shadow(${theme.shadow[1]})`,
    width: fluidSize(150),
    height: fluidSize(150),
    marginBottom: theme.spacing.small,
  },
  submitButton: {
    marginBottom: theme.spacing.medium,
  },
  buttons: {
    ...ROW_FLEX_BOX,
    marginTop: `calc(2 * ${theme.spacing.large})`,
    maxWidth: 600,
    transition: theme.animation.simple,
    padding: 0,
    "& button": {
      margin: theme.spacing.medium,
      width: "40vw",
      maxWidth: 400,
    },
    "& #sign-out": {
      backgroundColor: theme.color.text.alert,
    },
  },
  nibbleHistory: {
    maxWidth: 1000,
    marginBottom: `calc(${ATTRIBUTION_HEIGHT}px + ${theme.spacing.large})`,
  },
  attribution: {
    ...COLUMN_FLEX_BOX,
    height: ATTRIBUTION_HEIGHT,
    position: "absolute",
    bottom: theme.spacing.large,
    margin: "auto",
    "& h3": {
      fontSize: theme.fontSizes.medium,
      margin: 0,
    },
  },
  bottomNibbleLogo: {
    width: fluidSize(100),
    filter: `drop-shadow(0 0 10px ${withTransparency(theme.color.background, 0.5)})`,
  },
}));
