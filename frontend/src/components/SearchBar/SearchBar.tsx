import React, { useRef } from "react";
import { useDispatch } from "react-redux";

import { multipleClasses } from "../../common/theming/theming";
import { showSearch } from "../../redux/actions";
import { useStyles } from "./SearchBar.style";
import { SearchBarProps } from "./SearchBar.types";

/** Fully controlled component */
const SearchBar = (props: SearchBarProps) => {
  const classes = useStyles(props.searchFocused);
  const dispatch = useDispatch();
  const inputBoxRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={classes.container}>
      <form
        onSubmit={(event) => {
          props.onSearch();
          // blur element, allows next click to reactivate search box
          if (inputBoxRef.current) {
            inputBoxRef.current.blur();
          }
          event.preventDefault();
        }}
      >
        <i className={multipleClasses(["material-icons-outlined", classes.searchIcon])}>
          search
        </i>
        <input
          ref={inputBoxRef}
          className={classes.input}
          type={"text"}
          placeholder={"Search"}
          value={props.searchString}
          onFocus={() => {
            dispatch(showSearch());
          }}
          onChange={(event) => {
            props.setSearchString(event.target.value);
          }}
        />
      </form>
    </div>
  );
};

export default SearchBar;
