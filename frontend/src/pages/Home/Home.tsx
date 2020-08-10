import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { useQuery } from "@apollo/client";
import Auth from "@aws-amplify/auth";

import { appTheme } from "../../common/theming/theming";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import { NibbleCardReserved } from "../../components/NibbleCard";
import { PROFILE_PICTURE_PLACEHOLDER } from "../../components/S3Image/S3Image";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import { UserInfoQuery, UserInfoQueryVariables } from "../../graphql/generated/types";
import { USER_INFO } from "../../graphql/queries";
import { userSignOut } from "../../redux/actions";
import { useStyles } from "./Home.style";

const Home = () => {
  const { data } = useQuery<UserInfoQuery, UserInfoQueryVariables>(USER_INFO);

  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <div>
      <HeaderBar
        profilePicUrl={data?.userInfo.profilePicUrl || PROFILE_PICTURE_PLACEHOLDER}
      />
      <div className={classes.mainContent}>
        {data && data.userInfo.nibblesReserved && (
          <div>
            <SectionHeader name="Your Nibbles" color={appTheme.color.blue} />

            <div className={classes.nibbleCollection}>
              {data.userInfo.nibblesReserved.map((nibble) => {
                if (nibble) {
                  return <NibbleCardReserved key={nibble?.id} {...nibble} />;
                }
                return null;
              })}
            </div>
          </div>
        )}
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
