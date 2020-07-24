import { FieldRenderProps } from 'react-final-form';
import { createUseStyles } from 'react-jss';

import { AppTheme } from '../../common/theming.types';

export const useStyles = createUseStyles((theme: AppTheme) => ({
  input: {
    padding: theme.spacing.xSmall,
    paddingLeft: theme.spacing.medium,
    paddingRight: theme.spacing.medium,
    margin: theme.spacing.medium,
    background: (props: FieldRenderProps<String, any>) =>
      props.background ? props.background : theme.color.card[0],
    color: (props: FieldRenderProps<String, any>) =>
      props.color ? props.color : theme.color.text.primary,
    border: theme.color.card[0],
    textAlign: (props: FieldRenderProps<String, any>) =>
      props.center ? "center" : "left",
    fontSize: theme.fontSizes.medium,
    borderBottom: (props: FieldRenderProps<String, any>) =>
      (props.input.value.length || 0) > 0
        ? `1px solid ${theme.color.text.primary}`
        : `1px solid ${theme.color.text.grayed}`,
    transition: theme.animation.simple,
    fontFamily: "Baloo 2",
    "&:focus": {
      outline: "none",
    },
  },
}));
