import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { QueryResult, useQuery } from "@apollo/client";
import Auth from "@aws-amplify/auth";

import { appTheme } from "../../common/theming";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import S3Image, { PROFILE_PICTURE_PLACEHOLDER } from "../../components/S3Image/S3Image";
import S3ImageUpload from "../../components/S3ImageUpload";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import { S3ObjectDestination, UserInfoQuery } from "../../graphql/generated/types";
import { USER_INFO } from "../../graphql/queries";
import { userSignOut } from "../../redux/actions";
import { useStyles } from "./Home.style";

const Home = () => {
  const { loading, error, data } = useQuery(USER_INFO) as QueryResult<
    UserInfoQuery,
    null
  >;

  const [imageLoc, setImageLoc] = useState(PROFILE_PICTURE_PLACEHOLDER);

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
        <S3ImageUpload
          destination={S3ObjectDestination.UserProfilePictures}
          setImageLocation={setImageLoc}
        />
        <S3Image location={imageLoc} alt="test" />
      </div>
    </div>
  );
};

export default Home;
