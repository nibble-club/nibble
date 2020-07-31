import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming.types";
import { LabeledInputProps } from "./LabeledInput.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    width: "100%",
    textAlign: "right",
    display: "flex",
    alignItems: "center",
  },
  inputContainer: {
    textAlign: "left",
    width: (props: LabeledInputProps) =>
      props.inputWidth ? `${props.inputWidth}%` : "fit-content",
    marginLeft: theme.spacing.medium,
  },
  label: {
    transition: theme.animation.simple,
    fontWeight: "bold",
    width: "30%",
    paddingLeft: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
    lineHeight: 1.1,
  },
  "@media (max-width: 620px)": {
    container: {
      alignItems: "baseline",
      textAlign: "left",
      flexDirection: "column",
    },
    inputContainer: {
      width: _ => "70vw",
    },
    label: {
      width: "100%",
    },
  },
}));
