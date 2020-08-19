import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import { S3ObjectDestination } from "../../graphql/generated/types";
import S3ImageUpload from "./S3ImageUpload";
import { S3ImageUploadProps } from "./S3ImageUpload.types";

export default {
  component: S3ImageUpload,
  title: "Input/S3ImageUpload",
  excludeStories: /.*Props$/,
  args: {
    destination: S3ObjectDestination.UserProfilePictures,
  },
  argTypes: {
    setImageLocation: { action: "image location set" },
  },
} as Meta;

export const ImageUpload: Story<S3ImageUploadProps> = (args) => (
  <S3ImageUpload {...args} />
);
