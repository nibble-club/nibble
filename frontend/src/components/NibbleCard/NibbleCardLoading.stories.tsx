import React from "react";

import { NibbleCardLoading } from "./NibbleCardLoading";

export default {
  component: NibbleCardLoading,
  title: "Nibble Card - Loading",
  excludeStories: /.*Props$/,
};

export const Loading = () => <NibbleCardLoading />;
