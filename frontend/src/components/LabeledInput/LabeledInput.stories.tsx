import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import { LOGO_PLACEHOLDER } from "../S3Image/S3Image";
import { ImageUpload } from "../S3ImageUpload/S3ImageUpload.stories";
import { Empty } from "../TextInput/TextInput.stories";
import LabeledInput from "./LabeledInput";
import { LabeledInputProps } from "./LabeledInput.types";

export default {
  component: LabeledInput,
  title: "Input/LabeledInput",
  excludeStories: /.*Props$/,
  args: {
    label: "Email:",
    showError: false,
  },
} as Meta;

export const SimpleInput: Story<LabeledInputProps> = (args) => (
  <LabeledInput {...args}>
    {/* @ts-ignore */}
    <Empty {...Empty.args} />
  </LabeledInput>
);

export const WithExplanation: Story<LabeledInputProps> = (args) => (
  <LabeledInput {...args}>
    {/* @ts-ignore */}
    <Empty {...Empty.args} />
  </LabeledInput>
);
WithExplanation.args = {
  explanation: "Enter your email here",
};

export const WithError: Story<LabeledInputProps> = (args) => (
  <LabeledInput {...args}>
    {/* @ts-ignore */}
    <Empty {...Empty.args} />
  </LabeledInput>
);
WithError.args = {
  ...WithExplanation.args,
  error: "Invalid input",
  showError: true,
};

export const WithImagePreview: Story<LabeledInputProps> = (args) => (
  <LabeledInput {...args}>
    {/* @ts-ignore */}
    <ImageUpload {...ImageUpload.args} />
  </LabeledInput>
);
WithImagePreview.args = {
  label: "Logo:",
  explanation: "Upload your square logo here",
  imageToPreview: { location: LOGO_PLACEHOLDER, width: 100, height: 100 },
  alignLabelTop: true,
};
