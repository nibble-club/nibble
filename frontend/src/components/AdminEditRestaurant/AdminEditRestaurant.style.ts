import { createUseStyles } from "react-jss";

import { COLUMN_FLEX_BOX } from "../../common/theming";
import { AppTheme } from "../../common/theming.types";

export const formOuterContainerStyles = (theme: AppTheme) => ({
  ...COLUMN_FLEX_BOX,
  width: "100%",
  "& h2": {
    textAlign: "center",
    fontSize: theme.fontSizes.xLarge,
    margin: theme.spacing.large,
    lineHeight: 1.2,
  },
  "& button": {
    width: "fit-content",
    paddingLeft: theme.spacing.large,
    paddingRight: theme.spacing.large,
    margin: theme.spacing.large,
    marginBottom: `calc(2 * ${theme.spacing.large})`,
  },
});

export const selectStyles = (theme: AppTheme) => ({
  select: {
    margin: theme.spacing.medium,
  },
  selectActive: {
    margin: theme.spacing.medium,
    borderBottom: `1px solid ${theme.color.text.primary}`,
  },
});

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    ...formOuterContainerStyles(theme),
  },
  formContainer: {
    ...COLUMN_FLEX_BOX,
  },
  ...selectStyles(theme),
}));
