import React from "react";

import HeaderBar from "./HeaderBar";

export default {
  component: HeaderBar,
  title: "Header/HeaderBar",
  excludeStories: /.*Props$/,
  parameters: {
    layout: "fullscreen",
  },
};

const Template = () => <HeaderBar />;

export const Bar = Template.bind({});

export const AdminBar = Template.bind({});
