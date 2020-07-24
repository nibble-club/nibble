import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, Route, Switch } from "react-router-dom";

import { useQuery } from "@apollo/client";
import Auth from "@aws-amplify/auth";

import HeaderBar from "../../components/HeaderBar/HeaderBar";
import { PROFILE_PICTURE_PLACEHOLDER } from "../../components/S3Image/S3Image";
import { UserQuery } from "../../graphql/generated/types";
import { USER_INFO } from "../../graphql/queries";
import { QueryOf } from "../../graphql/types";
import { userSignOut } from "../../redux/actions";
import { RootState } from "../../redux/reducers";

const Home = () => {
  const id = useSelector((state: RootState) => state.user.id);
  const { loading, error, data } = useQuery(USER_INFO, {
    variables: { id },
  }) as QueryOf<UserQuery>;
  console.log(data);
  const dispatch = useDispatch();
  return (
    <div>
      <HeaderBar
        profilePicUrl={data?.userInfo.profilePicUrl || PROFILE_PICTURE_PLACEHOLDER}
      />
      <h1>Hello!</h1>
      <h3>
        Your name: {loading ? "loading..." : error ? "error!" : data?.userInfo.fullName}
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
  );
};

export default Home;
