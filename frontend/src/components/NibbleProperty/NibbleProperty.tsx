import React from "react";
import { createUseStyles } from "react-jss";

import { appTheme, multipleClasses } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";
import { NibblePropertyIcon, NibblePropertyProps } from "./NibbleProperty.types";

const colorForIcon = (icon: NibblePropertyIcon) => {
  if (icon === NibblePropertyIcon.Ingredients || icon === NibblePropertyIcon.Time) {
    return appTheme.color.blue;
  } else if (icon === NibblePropertyIcon.Prepared) {
    return appTheme.color.pink;
  } else if (
    icon === NibblePropertyIcon.Mystery ||
    icon === NibblePropertyIcon.Location
  ) {
    return appTheme.color.green;
  } else if (icon === NibblePropertyIcon.Time) {
    return appTheme.color.blue;
  } else {
    return appTheme.color.text.primary;
  }
};

const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    background: theme.color.card[1],
    color: (props: NibblePropertyProps) => colorForIcon(props.icon),
    width: "fit-content",
    paddingLeft: theme.spacing.xSmall,
    paddingRight: theme.spacing.xSmall,
    borderRadius: theme.rounding.hard,
    fontSize: theme.fontSizes.small,
    lineHeight: "100%",
    marginTop: theme.spacing.small,
    marginRight: theme.spacing.small,
    boxShadow: theme.shadow[1],
  },
  icon: {
    paddingRight: theme.spacing.xSmall,
    paddingTop: theme.spacing.xSmall,
  },
  iconFont: {
    fontSize: theme.fontSizes.small,
  },
  property: {
    paddingTop: theme.spacing.xSmall,
    paddingRight: theme.spacing.small,
    paddingLeft: theme.spacing.xSmall,
  },
}));

const NibbleProperty = (props: NibblePropertyProps) => {
  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      <div className={classes.icon}>
        <i className={multipleClasses(["material-icons-outlined", classes.iconFont])}>
          {props.icon}
        </i>
      </div>
      <div className={classes.property}>{props.text}</div>
    </div>
  );
};

export default NibbleProperty;
