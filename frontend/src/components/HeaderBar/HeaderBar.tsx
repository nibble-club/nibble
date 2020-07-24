import React, { useState } from "react";

import S3Image from "../S3Image/S3Image";
import SearchBar from "../SearchBar/SearchBar";
import { useStyles } from "./HeaderBar.style";
import { HeaderBarProps } from "./HeaderBar.types";

const HeaderBar = (props: HeaderBarProps) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const classes = useStyles(searchFocused);

  return (
    <div className={classes.container}>
      <img
        className={classes.logo}
        src={require("../../imgs/n-orange.png")}
        alt={"Nibble logo"}
      />
      <div className={classes.search}>
        <SearchBar searchFocused={searchFocused} setSearchFocused={setSearchFocused} />
      </div>
      <S3Image
        className={classes.profilePic}
        location={props.profilePicUrl}
        alt="profile"
      />
    </div>
  );
};

export default HeaderBar;
