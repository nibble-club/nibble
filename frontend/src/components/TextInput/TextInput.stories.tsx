import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import TextInput from "./TextInput";
import { TextInputProps } from "./TextInput.types";

export default {
  component: TextInput,
  title: "Input/TextInput",
  excludeStories: /.*Props$/,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    input: {
      name: "email",
      type: "text",
      value: "",
    },
    meta: {},
    placeholder: "Enter your email",
    center: false,
  },
  argTypes: {
    "input.onBlur": { action: "field-blurred" },
    "input.onChange": { action: "field-changed" },
    "input.onFocus": { action: "field-focused" },
    background: { control: "color" },
    color: { control: "color" },
  },
} as Meta;

const Template: Story<TextInputProps> = (args) => (
  <TextInput
    {...args}
    input={{
      ...args.input,
      onBlur: args["input.onBlur"],
      onChange: args["input.onChange"],
      onFocus: args["input.onFocus"],
    }}
  />
);

export const Empty = Template.bind({});

export const Filled = Template.bind({});
Filled.args = {
  // @ts-ignore
  input: {
    value: "abc@xyz.com",
  },
};
