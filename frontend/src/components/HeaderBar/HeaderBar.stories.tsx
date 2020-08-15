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

export const Bar = () => <HeaderBar />;

export const AdminBar = () => <HeaderBar />;
