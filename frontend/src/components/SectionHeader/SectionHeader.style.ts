import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming.types";
import { SectionHeaderProps } from "./SectionHeader.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    padding: theme.spacing.small,
    paddingLeft: theme.spacing.large,
    paddingRight: theme.spacing.large,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: (props: SectionHeaderProps) => props.color,
    fontWeight: "bold",
    paddingLeft: theme.spacing.large,
    paddingRight: theme.spacing.large,
    margin: 0,
  },
  lines: {
    flexGrow: 1,
    backgroundColor: (props: SectionHeaderProps) => props.color,
    height: 1,
    border: "none",
  },
}));
