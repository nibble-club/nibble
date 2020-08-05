import React from "react";

import { multipleClasses } from "../../common/theming/theming";
import { useStyles } from "./SearchBar.style";
import { SearchBarProps } from "./SearchBar.types";

const SearchBar = (props: SearchBarProps) => {
  const classes = useStyles(props.searchFocused);

  return (
    <div className={classes.container}>
      <i className={multipleClasses(["material-icons-outlined", classes.searchIcon])}>
        search
      </i>
      <input
        className={classes.input}
        type={"text"}
        placeholder={"Search"}
        onFocus={() => props.setSearchFocused(true)}
        onBlur={() => props.setSearchFocused(false)}
      />
    </div>
  );
};

export default SearchBar;
