import React from "react";
import { NibblePropertyProps } from "../types/props";
import { createUseStyles } from "react-jss";
import { AppTheme } from "../types/styles";

const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    background: theme.color.card[1],
    color: (props: NibblePropertyProps) => props.color,
    width: "fit-content",
    // paddingTop: theme.spacing.small,
    // paddingBottom: theme.spacing.small,
    paddingLeft: theme.spacing.xSmall,
    paddingRight: theme.spacing.xSmall,
    borderRadius: theme.rounding.hard,
  },
  icon: {
    paddingLeft: theme.spacing.xSmall,
    paddingRight: theme.spacing.xSmall,
    paddingTop: theme.spacing.small,
  },
  property: {
    padding: theme.spacing.xSmall,
    paddingRight: theme.spacing.small,
  },
}));

const NibbleProperty = (props: NibblePropertyProps) => {
  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      <div className={classes.icon}>
        <span className={props.icon}></span>
      </div>
      <div className={classes.property}>{props.text}</div>
    </div>
  );
};

export default NibbleProperty;
