import React from "react";

import { useStyles } from "./FormSection.style";

const FormSection = ({
  children,
  margin = true,
  padding = false,
}: {
  children: React.ReactNode;
  margin?: boolean;
  padding?: boolean;
}) => {
  const classes = useStyles({ margin, padding });

  return <div className={classes.formSection}>{children}</div>;
};

export default FormSection;
