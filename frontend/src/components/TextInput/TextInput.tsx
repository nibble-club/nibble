import React from "react";
import TextareaAutosize from "react-autosize-textarea";

import { multipleClasses } from "../../common/theming";
import { useStyles } from "./TextInput.style";
import { TextInputProps } from "./TextInput.types";

const TextInput = (fieldRenderProps: TextInputProps) => {
  const classes = useStyles(fieldRenderProps);
  return fieldRenderProps.input.type === "textarea" ? (
    <TextareaAutosize
      className={multipleClasses([classes.input, classes.textarea])}
      placeholder={fieldRenderProps.placeholder}
      {...fieldRenderProps.input}
    />
  ) : (
    <input
      className={classes.input}
      type={fieldRenderProps.input.type || "text"}
      placeholder={fieldRenderProps.placeholder}
      {...fieldRenderProps.input}
    />
  );
};

export default TextInput;
