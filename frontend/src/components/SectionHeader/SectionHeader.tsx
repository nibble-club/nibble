import React from "react";

import { useStyles } from "./SectionHeader.style";
import { SectionHeaderProps } from "./SectionHeader.types";

const SectionHeader = (props: SectionHeaderProps) => {
  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      <hr className={classes.lines} />
      <h3 className={classes.text}>{props.name}</h3>
      <hr className={classes.lines} />
    </div>
  );
};

export default SectionHeader;
