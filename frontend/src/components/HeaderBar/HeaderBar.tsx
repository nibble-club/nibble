import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { useLazyQuery } from "@apollo/client";

import {
  RestaurantForAdminQuery,
  RestaurantForAdminQueryVariables,
  S3Object,
  UserInfoQuery,
  UserInfoQueryVariables
} from "../../graphql/generated/types";
import { RESTAURANT_FOR_ADMIN, USER_INFO } from "../../graphql/queries";
import { hideSearch } from "../../redux/actions";
import { RootState } from "../../redux/reducers";
import S3Image, { PROFILE_PICTURE_PLACEHOLDER } from "../S3Image/S3Image";
import SearchBar from "../SearchBar/SearchBar";
import SearchOverlay from "../SearchOverlay";
import { useStyles } from "./HeaderBar.style";

/** Manages search experience, shows header on top of page above all content */
const HeaderBar = () => {
  const searchFocused = useSelector((state: RootState) => state.search.show);
  const history = useHistory();
  const dispatch = useDispatch();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const classes = useStyles(searchFocused);
  const isAdmin = useSelector((state: RootState) => state.user.admin);
  const [searchString, setSearchString] = useState("");
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [pickupAfter, setPickupAfter] = useState<moment.Moment | null>(null);
  const [fetchUserData, { data: userData }] = useLazyQuery<
    UserInfoQuery,
    UserInfoQueryVariables
  >(USER_INFO);
  const [fetchAdminData, { data: adminData }] = useLazyQuery<
    RestaurantForAdminQuery,
    RestaurantForAdminQueryVariables
  >(RESTAURANT_FOR_ADMIN);
  const [profilePicUrl, setProfilePicUrl] = useState<S3Object>(
    PROFILE_PICTURE_PLACEHOLDER
  );

  // fetch relevant profile picture
  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      fetchUserData();
    }
  }, [isAdmin, fetchAdminData, fetchUserData]);

  // set profile picture on data loaded
  useEffect(() => {
    if (adminData) {
      setProfilePicUrl(adminData.restaurantForAdmin.logoUrl);
    }
    if (userData) {
      setProfilePicUrl(userData.userInfo.profilePicUrl);
    }
  }, [adminData, userData]);

  return (
    <div>
      <SearchOverlay
        headerRef={headerRef}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        pickupAfter={pickupAfter}
        setPickupAfter={setPickupAfter}
      />
      <div className={classes.container} ref={headerRef}>
        <Link to={{ pathname: isAdmin ? "/admin" : "/" }}>
          <img
            className={classes.logo}
            src={require("../../imgs/n-orange.png")}
            alt={"Nibble logo"}
          />
        </Link>
        <div className={classes.search}>
          {isAdmin ? (
            <h1>{adminData?.restaurantForAdmin.name || "Admin"}</h1>
          ) : (
            <SearchBar
              searchFocused={searchFocused}
              searchString={searchString}
              setSearchString={setSearchString}
              onSearch={() => {
                console.log(`Searching ${searchString}`);
                history.push(
                  `/search?query=${searchString}` +
                    (maxDistance ? `&maxDistance=${maxDistance}` : "") +
                    (pickupAfter ? `&pickupAfter=${pickupAfter.unix()}` : "")
                );
                setMaxDistance(null);
                setPickupAfter(null);
                dispatch(hideSearch());
              }}
            />
          )}
        </div>
        <S3Image
          className={classes.profilePic}
          location={profilePicUrl}
          alt="profile"
        />
      </div>
    </div>
  );
};

export default HeaderBar;
