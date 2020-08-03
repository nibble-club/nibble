import Maybe from "graphql/tsutils/Maybe";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";

import { QueryResult, useQuery } from "@apollo/client";
import Auth from "@aws-amplify/auth";

import HeroImage from "../../components/HeroImage/HeroImage";
import {
  NibbleAvailableInfoFragment,
  RestaurantForAdminQuery,
  RestaurantForAdminQueryVariables
} from "../../graphql/generated/types";
import { RESTAURANT_FOR_ADMIN } from "../../graphql/queries";
import { userSignOut } from "../../redux/actions";
import { NibbleCardAvailable } from "../NibbleCard";
import { useStyles } from "./AdminHome.style";
import { AdminHomeProps } from "./AdminHome.types";

const AdminHome = (props: AdminHomeProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let { url } = useRouteMatch();
  const { loading, error, data } = useQuery(RESTAURANT_FOR_ADMIN) as QueryResult<
    RestaurantForAdminQuery,
    RestaurantForAdminQueryVariables
  >;

  return (
    <div>
      <HeroImage location={props.restaurant.heroUrl} />
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
          data?.restaurantForAdmin.nibblesAvailable.map(
            (nibble: Maybe<NibbleAvailableInfoFragment>) => {
              if (nibble) {
                return (
                  <Link
                    to={{ pathname: `${url}/edit_nibble/${nibble.id}` }}
                    key={nibble.id}
                  >
                    <NibbleCardAvailable
                      {...nibble}
                      restaurantName={data.restaurantForAdmin.name}
                    />
                  </Link>
                );
              }
            }
          )}
      </div>
    </div>
  );
};

export default AdminHome;
