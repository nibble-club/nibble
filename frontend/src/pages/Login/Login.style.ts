import { createUseStyles } from "react-jss";

import { fluidSize } from "../../common/theming";
import { AppTheme } from "../../common/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  centerContainer: {
    width: "100%",
    height: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  componentContainer: {
    padding: theme.spacing.large,
    width: "min(85%, 550px)",
    background: theme.color.card[0],
    borderRadius: theme.rounding.medium,
    boxShadow: theme.shadow[3],
  },
  nibbleLogoContainer: {
    padding: theme.spacing.medium,
    margin: "auto",
    display: "table",
    marginBottom: theme.spacing.large,
  },
  nibbleLogo: {
    width: "80%",
    filter: `drop-shadow(${theme.shadow[1]})`,
  },
  email: {
    fontWeight: "normal",
  },
  formContainer: {
    textAlign: "center",
    "& input": {
      width: `min(450px, 85%)`,
      fontSize: fluidSize(10, 2),
    },
    "& button": {
      margin: theme.spacing.large,
      marginBottom: theme.spacing.small,
      width: "70%",
      cursor: "pointer",
    },
    "& span": {
      display: "block",
      color: theme.color.text.alert,
      fontSize: theme.fontSizes.small,
      marginTop: theme.spacing.medium,
    },
  },
  forgotPassword: {
    color: theme.color.text.grayed,
    "& a": {
      transition: theme.animation.simple,
      color: theme.color.text.grayed,
      fontSize: theme.fontSizes.xSmall,
      paddingLeft: theme.spacing.medium,
      paddingRight: theme.spacing.medium,
      "&:visited": {
        color: theme.color.text.grayed,
      },
      "&:hover": {
        color: theme.color.text.primary,
      },
    },
  },
}));
