import React from "react";

import { NibbleCardLoading } from "./NibbleCardLoading";

export default {
  component: NibbleCardLoading,
  title: "Nibbles/NibbleCardLoading",
  excludeStories: /.*Props$/,
};

export const Loading = () => <NibbleCardLoading />;
