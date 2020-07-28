import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { useQuery } from "@apollo/client";
import Auth from "@aws-amplify/auth";

import { appTheme } from "../../common/theming";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import { PROFILE_PICTURE_PLACEHOLDER } from "../../components/S3Image/S3Image";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import { UserInfoQuery } from "../../graphql/generated/types";
import { USER_INFO } from "../../graphql/queries";
import { QueryFor } from "../../graphql/types";
import { userSignOut } from "../../redux/actions";
import { useStyles } from "./Home.style";

const Home = () => {
  const { loading, error, data } = useQuery(USER_INFO) as QueryFor<UserInfoQuery>;

  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <div>
      <HeaderBar
        profilePicUrl={data?.userInfo.profilePicUrl || PROFILE_PICTURE_PLACEHOLDER}
      />
      <div className={classes.mainContent}>
        <SectionHeader name="Your Nibbles" color={appTheme.color.blue} />
        <h1>Hello!</h1>
        <h3>
          Your name:{" "}
          {loading ? "loading..." : error ? "error!" : data?.userInfo.fullName}
        </h3>
        <Link
          to={{ pathname: "/login", state: { referrer: "/" } }}
          onClick={async () => {
            dispatch(userSignOut());
            await Auth.signOut();
          }}
        >
          Sign out
        </Link>
      </div>
    </div>
  );
};

export default Home;
