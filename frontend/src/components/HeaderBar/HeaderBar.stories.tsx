import React from "react";

import HeaderBar from "./HeaderBar";

export default {
  component: HeaderBar,
  title: "HeaderBar",
  excludeStories: /.*Props$/,
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
