import { createUseStyles } from "react-jss";

import { COLUMN_FLEX_BOX, ROW_FLEX_BOX } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    display: ({ show }) => (show ? "block" : "none"),
    position: "fixed",
    top: `calc(${theme.headerHeight} - ${theme.rounding.medium}px)`,
    left: "50%",
    transform: "translate(-50%, 0%)",
    boxShadow: theme.shadow[2],
    minHeight: 550,
    zIndex: 90,
    borderRadius: `0px 0px ${theme.rounding.medium}px ${theme.rounding.medium}px`,
    width: `100%`,
    maxWidth: 620,
    paddingTop: theme.spacing.large,
    backgroundColor: theme.color.card[0],
    transition: theme.animation.exciting,
  },
  selectors: {
    ...ROW_FLEX_BOX,
    width: "fit-content",
    margin: "auto",
    borderBottom: `1px solid ${theme.color.text.grayed}`,
    paddingBottom: theme.spacing.medium,
    marginBottom: 0,
  },
  header: {
    margin: 0,
    marginBottom: theme.spacing.medium,
    lineHeight: 1,
  },
  history: {
    margin: theme.spacing.large,
    marginTop: `calc(2 * ${theme.spacing.medium})`,
  },
  historyItem: {
    ...ROW_FLEX_BOX,
    justifyContent: "start",
    "& p": {
      fontSize: theme.fontSizes.large,
      lineHeight: 1.1,
      margin: 0,
      marginLeft: theme.spacing.small,
      marginBottom: theme.spacing.medium,
      color: theme.color.text.primary,
    },
    "& span": {
      marginBottom: theme.spacing.medium,
      marginLeft: theme.spacing.medium,
      lineHeight: 1.1,
      color: theme.color.text.grayed,
    },
  },
  loading: {
    margin: 0,
    marginLeft: theme.spacing.small,
    marginBottom: theme.spacing.medium,
    height: 20,
  },
}));

export const useBoxStyles = createUseStyles((theme: AppTheme) => ({
  box: {
    ...ROW_FLEX_BOX,
    padding: theme.spacing.medium,
    background: theme.color.card[1],
    boxShadow: theme.shadow[0],
    borderRadius: theme.rounding.hard,
    margin: theme.spacing.medium,
    cursor: "pointer",
    "& span": {
      lineHeight: 1.1,
      marginTop: 0,
      marginBottom: 0,
      width: "min-content",
      textAlign: "center",
    },
  },
  selectorContent: {
    ...COLUMN_FLEX_BOX,
    paddingBottom: theme.spacing.large,
    maxWidth: 500,
    background: theme.color.card[0],
    borderRadius: theme.rounding.medium,
    boxShadow: theme.shadow[3],
  },
  okButton: {
    marginTop: theme.spacing.small,
  },
  label: {
    color: theme.color.text.primary,
    marginRight: theme.spacing.medium,
  },
  value: {
    color: theme.color.blue,
  },
}));
