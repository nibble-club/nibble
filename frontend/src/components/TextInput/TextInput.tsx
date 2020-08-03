import React from "react";
import TextareaAutosize from "react-autosize-textarea";

import MomentUtils from "@date-io/moment";
import { TextFieldProps } from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { multipleClasses } from "../../common/theming";
import { useStyles } from "./TextInput.style";
import { TextInputProps } from "./TextInput.types";

const dateTextField = (name: string) => (props: TextFieldProps) => (
  <TextInput
    input={{
      ...props.inputProps,
      id: props.id,
      name,
      type: "text",
      value: props.value,
      onBlur: () => {},
      onChange: () => {},
      onFocus: () => {},
      onClick: (e: any) => {
        props.onClick && props.onClick(e);
      },
      ref: props.inputRef,
    }}
    meta={{}}
    {...props}
  />
);

const TextInput = (fieldRenderProps: TextInputProps) => {
  const classes = useStyles(fieldRenderProps);
  return fieldRenderProps.input.type === "textarea" ? (
    <TextareaAutosize
      className={multipleClasses([classes.input, classes.textarea])}
      placeholder={fieldRenderProps.placeholder}
      {...fieldRenderProps.input}
    />
  ) : fieldRenderProps.input.type === "datetime" ? (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DateTimePicker
        value={fieldRenderProps.input.value}
        onChange={fieldRenderProps.input.onChange}
        variant="dialog"
        minutesStep={15}
        disableFuture={fieldRenderProps.datetimeOptions?.disableFuture}
        disablePast={fieldRenderProps.datetimeOptions?.disablePast}
        TextFieldComponent={dateTextField(fieldRenderProps.input.name)}
        allowKeyboardControl={false}
      />
    </MuiPickersUtilsProvider>
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
