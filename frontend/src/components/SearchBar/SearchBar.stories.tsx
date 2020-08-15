import React, { useState } from "react";

import { action } from "@storybook/addon-actions";

import SearchBar from "./SearchBar";

export default {
  component: SearchBar,
  title: "SearchBar",
  excludeStories: /.*Props$/,
};

export const Focused = () => {
  const [searchString, setSearchString] = useState("");
  return (
    <SearchBar
      searchFocused
      setSearchString={setSearchString}
      onSearch={action("searching")}
      searchString={searchString}
    />
  );
};

export const NotFocused = () => {
  const [searchString, setSearchString] = useState("");
  return (
    <SearchBar
      searchFocused={false}
      setSearchString={setSearchString}
      onSearch={action("searching")}
      searchString={searchString}
    />
  );
};
