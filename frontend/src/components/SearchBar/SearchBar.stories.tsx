import React, { useState } from "react";

import SearchBar from "./SearchBar";

export default {
  component: SearchBar,
  title: "SearchBar",
  excludeStories: /.*Props$/,
};

export const Empty = () => {
  const [focus, setFocus] = useState(false);
  return <SearchBar searchFocused={focus} setSearchFocused={setFocus} />;
};
