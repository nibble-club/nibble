import React from "react";
import { useDispatch } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";

import { useApolloClient, useQuery } from "@apollo/client";
import Auth from "@aws-amplify/auth";

import HeroImage from "../../components/HeroImage/HeroImage";
import {
  RestaurantForAdminQuery,
  RestaurantForAdminQueryVariables
} from "../../graphql/generated/types";
import { RESTAURANT_FOR_ADMIN } from "../../graphql/queries";
import { userSignOut } from "../../redux/actions";
import { NibbleCardAvailable } from "../NibbleCard";
import { HERO_PLACEHOLDER } from "../S3Image/S3Image";
import { useStyles } from "./AdminHome.style";

const AdminHome = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let { url } = useRouteMatch();
  const { loading, error, data } = useQuery<
    RestaurantForAdminQuery,
    RestaurantForAdminQueryVariables
  >(RESTAURANT_FOR_ADMIN);
  const client = useApolloClient();

  return (
    <div>
      <HeroImage
        loading={!data}
        location={data?.restaurantForAdmin.heroUrl || HERO_PLACEHOLDER}
      />
      {data &&
        (data.restaurantForAdmin.active ? (
          <div>
            <div className={classes.menu}>
              <div>
                <Link to={{ pathname: `${url}/edit` }}>
                  <button>Edit restaurant details</button>
                </Link>
              </div>
              <div>
                <Link to={{ pathname: `${url}/edit_nibble/new` }}>
                  <button>Create new Nibble</button>
                </Link>
              </div>
              <div>
                <button>See available Nibbles</button>
              </div>
              <div>
                <Link
                  to={{ pathname: "/login", state: { referrer: "/" } }}
                  onClick={async () => {
                    dispatch(userSignOut());
                    await Auth.signOut();
                  }}
                >
                  <button>Sign out</button>
                </Link>
              </div>
            </div>
            <h3>Available Nibbles:</h3>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {!loading &&
                !error &&
                data?.restaurantForAdmin.nibblesAvailable.map((nibble) => (
                  <Link
                    to={{ pathname: `${url}/edit_nibble/${nibble.id}` }}
                    key={nibble.id}
                  >
                    <NibbleCardAvailable {...nibble} />
                  </Link>
                ))}
            </div>
          </div>
        ) : (
          <div className={classes.inactive}>
            <h1>Your restaurant is not active; contact support to reactivate.</h1>
            <Link
              to={{ pathname: "/login", state: { referrer: "/" } }}
              onClick={async () => {
                dispatch(userSignOut());
                client.clearStore();
                await Auth.signOut();
              }}
            >
              <button>Sign out</button>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default AdminHome;
