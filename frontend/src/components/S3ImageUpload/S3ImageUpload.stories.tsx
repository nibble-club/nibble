import React from "react";

import { action } from "@storybook/addon-actions";

import { S3ObjectDestination } from "../../graphql/generated/types";
import S3ImageUpload from "./S3ImageUpload";
import { S3ImageUploadProps } from "./S3ImageUpload.types";

export default {
  component: S3ImageUpload,
  title: "S3ImageUpload",
  excludeStories: /.*Props$/,
};

export const UploadProps: S3ImageUploadProps = {
  destination: S3ObjectDestination.UserProfilePictures,
  setImageLocation: action("image-location-set"),
};

export const ImageUpload = () => <S3ImageUpload {...UploadProps} />;
