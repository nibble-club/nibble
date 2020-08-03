import React from "react";

import { boolean, text, withKnobs } from "@storybook/addon-knobs";

import { S3ObjectDestination } from "../../graphql/generated/types";
import { LOGO_PLACEHOLDER } from "../S3Image/S3Image";
import S3ImageUpload from "../S3ImageUpload";
import TextInput from "../TextInput";
import LabeledInput from "./LabeledInput";

export default {
  component: LabeledInput,
  title: "LabeledInput",
  excludeStories: /.*Props$/,
  decorators: [withKnobs],
  // parameters: {
  //   knobs: {
  //     escapeHTML: false,
  //   },
  // },
};

const textFieldProps = {
  input: {
    name: "email",
    type: "text",
    value: "",
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
  },
  meta: {},
  placeholder: "",
  center: false,
};

export const SimpleInput = () => (
  <LabeledInput label={text("Label", "Email:", "Simple Input")}>
    <TextInput {...textFieldProps} />
  </LabeledInput>
);

export const WithExplanation = () => (
  <LabeledInput
    label={text("Label", "Email:", "With Explanation")}
    explanation={text("Explanation", "Enter your email here", "With Explanation")}
  >
    <TextInput {...textFieldProps} />
  </LabeledInput>
);

export const WithError = () => (
  <LabeledInput
    label={text("Label", "Email:", "With Error")}
    explanation={text("Explanation", "Enter your email here", "With Error")}
    error={text("Error", "Invalid input", "With Error")}
    showError={boolean("Show Error", true, "With Error")}
  >
    <TextInput {...textFieldProps} />
  </LabeledInput>
);

export const WithImagePreview = () => (
  <LabeledInput
    label={text("Label", "Logo:", "With Image Preview")}
    explanation={text(
      "Explanation",
      "Upload your square logo here",
      "With Image Preview"
    )}
    imageToPreview={{ location: LOGO_PLACEHOLDER, width: 100, height: 100 }}
    alignLabelTop={boolean("Align Label at Top", true, "With Image Preview")}
  >
    <S3ImageUpload
      setImageLocation={() => {}}
      destination={S3ObjectDestination.RestaurantLogos}
    />
  </LabeledInput>
);
