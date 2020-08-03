import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming.types";
import { TextInputProps } from "./TextInput.types";

export const useStyles = createUseStyles((theme: AppTheme) => ({
  input: {
    padding: theme.spacing.xSmall,
    paddingLeft: theme.spacing.medium,
    paddingRight: theme.spacing.medium,
    margin: theme.spacing.medium,
    width: "100%",
    minWidth: 220,
    textAlign: (props: TextInputProps) => (props.center ? "center" : "left"),
    border: theme.color.card[0],
    fontSize: theme.fontSizes.medium,
    borderBottom: (props: TextInputProps) =>
      (props.input?.value && `1px solid ${theme.color.text.primary}`) ||
      `1px solid ${theme.color.text.grayed}`,
    transition: theme.animation.simple,
    fontFamily: '"Baloo 2"',
    "&:focus": {
      outline: "none",
    },
    background: (props: TextInputProps) =>
      props.background ? props.background : theme.color.card[0],
    color: (props: TextInputProps) =>
      props.color ? props.color : theme.color.text.primary,
    resize: "none",
  },
  textarea: {
    transition: theme.animation.simple,
  },
}));
