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

export const getS3ImageUrl = (location: S3Object) => {
  let url = `https://${location.bucket}.s3-${location.region}.amazonaws.com/${location.key}`;
  if (location.bucket === "PLACEHOLDER") {
    if (location.key === PROFILE_PICTURE_PLACEHOLDER.key) {
      url = require("../../imgs/default-avatar.jpg");
    } else if (location.key === LOGO_PLACEHOLDER.key) {
      url = require("../../imgs/n-orange.png");
    } else if (location.key === HERO_PLACEHOLDER.key) {
      url = require("../../imgs/plate.png");
    }
  }

  // patch old profile picture default
  if (location.bucket === "") {
    url = require("../../imgs/default-avatar.jpg");
  }

  return url;
};

const S3Image = ({ location, alt, imageRef, ...rest }: S3ImageProps) => {
  const url = getS3ImageUrl(location);

  return <img src={url} alt={alt} ref={imageRef} {...rest} />;
};

export default S3Image;
