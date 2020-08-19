import React, { useState } from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import SearchBar from "./SearchBar";
import { SearchBarProps } from "./SearchBar.types";

export default {
  component: SearchBar,
  title: "Header/SearchBar",
  excludeStories: /.*Props$/,
  argTypes: {
    onSearch: { action: "searched", table: { disable: true } },
    searchString: { table: { disable: true } },
    setSearchString: { table: { disable: true } },
  },
} as Meta;

const Template: Story<Pick<SearchBarProps, "onSearch" | "searchFocused">> = (args) => {
  const [searchString, setSearchString] = useState("");
  return (
    <SearchBar
      searchString={searchString}
      setSearchString={setSearchString}
      {...args}
    />
  );
};

export const Focused = Template.bind({});
Focused.args = {
  searchFocused: true,
};

export const NotFocused = Template.bind({});
NotFocused.args = {
  searchFocused: false,
};
