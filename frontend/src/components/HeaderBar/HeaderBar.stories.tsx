import React from "react";

import { text, withKnobs } from "@storybook/addon-knobs";

import HeaderBar from "./HeaderBar";

export default {
  component: HeaderBar,
  title: "HeaderBar",
  excludeStories: /.*Props$/,
  decorators: [withKnobs],
  parameters: {
    knobs: {
      escapeHTML: false,
    },
  },
};

export const Bar = () => (
  <HeaderBar
    profilePicUrl={{
      bucket: "800344761765-dev-adchurch-profile-pics",
      region: "us-west-2",
      key: "andrew-churchill.jpg",
    }}
  />
);

export const AdminBar = () => (
  <HeaderBar
    profilePicUrl={{
      bucket: "800344761765-dev-adchurch-profile-pics",
      region: "us-west-2",
      key: "andrew-churchill.jpg",
    }}
    adminName={text("Restaurant Name", "Symphony Sushi")}
  />
);
