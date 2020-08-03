import React from "react";

import { useStyles } from "./FormSection.style";

const FormSection = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();

  return <div className={classes.formSection}>{children}</div>;
};

export default FormSection;
