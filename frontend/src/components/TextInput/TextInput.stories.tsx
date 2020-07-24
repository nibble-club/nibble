import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { action } from '@storybook/addon-actions';

import TextInput from './TextInput';

export default {
  component: TextInput,
  title: "TextInput",
  excludeStories: /.*Props$/,
};

export const EmptyTextFieldProps: FieldRenderProps<string, any> = {
  input: {
    name: "email",
    type: "text",
    value: "",
    onBlur: action("field-blurred"),
    onChange: action("field-changed"),
    onFocus: action("field-focused"),
  },
  meta: {},
  placeholder: "Enter your email",
  center: false,
};

export const FilledTextFieldProps: FieldRenderProps<string, any> = {
  ...EmptyTextFieldProps,
  input: {
    ...EmptyTextFieldProps.input,
    value: "abc@xyz.com",
  },
};

export const EmptyTextFieldInput = () => <TextInput {...EmptyTextFieldProps} />;

export const FilledTextFieldInput = () => (
  <TextInput {...FilledTextFieldProps} />
);
