import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { RootState } from "../../redux/reducers";
import S3Image from "../S3Image/S3Image";
import SearchBar from "../SearchBar/SearchBar";
import { useStyles } from "./HeaderBar.style";
import { HeaderBarProps } from "./HeaderBar.types";

const HeaderBar = (props: HeaderBarProps) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const classes = useStyles(searchFocused);
  const isAdmin = useSelector((state: RootState) => state.user.admin);

  return (
    <div className={classes.container}>
      <Link to={{ pathname: isAdmin ? "/admin" : "/" }}>
        <img
          className={classes.logo}
          src={require("../../imgs/n-orange.png")}
          alt={"Nibble logo"}
        />
      </Link>
      <div className={classes.search}>
        {props.adminName ? (
          <h1>{props.adminName}</h1>
        ) : (
          <SearchBar
            searchFocused={searchFocused}
            setSearchFocused={setSearchFocused}
          />
        )}
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
