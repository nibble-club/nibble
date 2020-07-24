import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { useStyles } from './TextInput.style';

const TextInput = (fieldRenderProps: FieldRenderProps<string, any>) => {
  const classes = useStyles(fieldRenderProps);
  return (
    <input
      className={classes.input}
      type={fieldRenderProps.input.type || "text"}
      placeholder={fieldRenderProps.placeholder}
      {...fieldRenderProps.input}
    />
  );
};

export default TextInput;
