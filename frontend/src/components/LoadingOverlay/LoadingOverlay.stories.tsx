import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import S3Image from "../S3Image";
import { HERO_PLACEHOLDER } from "../S3Image/S3Image";
import LoadingOverlay from "./LoadingOverlay";
import { LoadingOverlayProps } from "./LoadingOverlay.types";

export default {
  component: LoadingOverlay,
  title: "Utilities/LoadingOverlay",
  excludeStories: /.*Props$/,
} as Meta;

export const LoadingOverImage: Story<LoadingOverlayProps> = (args) => (
  <div>
    <LoadingOverlay {...args} />
    <S3Image location={HERO_PLACEHOLDER} alt="hero" />
  </div>
);
LoadingOverImage.args = {
  show: false,
};
