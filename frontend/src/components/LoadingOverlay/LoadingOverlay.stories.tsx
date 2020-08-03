import React from "react";

import { boolean, withKnobs } from "@storybook/addon-knobs";

import S3Image from "../S3Image";
import { HERO_PLACEHOLDER } from "../S3Image/S3Image";
import LoadingOverlay from "./LoadingOverlay";

export default {
  component: LoadingOverlay,
  title: "LoadingOverlay",
  excludeStories: /.*Props$/,
  decorators: [withKnobs],
  parameters: {
    knobs: {
      escapeHTML: false,
    },
  },
};

export const LoadingOverImage = () => (
  <div>
    <LoadingOverlay show={boolean("Show overlay", true)} />
    <S3Image location={HERO_PLACEHOLDER} alt="hero" />
  </div>
);
