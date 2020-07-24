import React from "react";

import { S3Object } from "../../graphql/generated/types";
import { S3ImageProps } from "./S3Image.types";

// define placeholders
export const PROFILE_PICTURE_PLACEHOLDER: S3Object = {
  bucket: "PLACEHOLDER",
  region: "",
  key: "profile",
};

export const LOGO_PLACEHOLDER: S3Object = {
  bucket: "PLACEHOLDER",
  region: "",
  key: "logo",
};

export const HERO_PLACEHOLDER: S3Object = {
  bucket: "PLACEHOLDER",
  region: "",
  key: "hero",
};

const S3Image = ({ location, alt, ...rest }: S3ImageProps) => {
  let url = `https://${location.bucket}.s3-${location.region}.amazonaws.com/${location.key}`;
  if (location.bucket === "PLACEHOLDER") {
    if (location.key === PROFILE_PICTURE_PLACEHOLDER.key) {
      url = require("../../imgs/default-avatar.jpg");
    } else if (location.key === LOGO_PLACEHOLDER.key) {
      url = require("../../imgs/n-orange.png");
    } else if (location.key === HERO_PLACEHOLDER.key) {
      url = require("../../imgs/plate.svg");
    }
  }

  // patch old profile picture default
  if (location.bucket === "") {
    url = require("../../imgs/default-avatar.jpg");
  }

  return <img src={url} alt={alt} {...rest} />;
};

export default S3Image;
