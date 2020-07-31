import React from "react";
import { useDispatch } from "react-redux";
import { Link, Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { QueryResult, useQuery } from "@apollo/client";
import Auth from "@aws-amplify/auth";

import AdminCreateRestaurant from "../../components/AdminCreateRestaurant";
import HeaderBar from "../../components/HeaderBar";
import HeroImage from "../../components/HeroImage/HeroImage";
import {
  HERO_PLACEHOLDER,
  PROFILE_PICTURE_PLACEHOLDER
} from "../../components/S3Image/S3Image";
import {
  RestaurantForAdminQuery,
  RestaurantForAdminQueryVariables
} from "../../graphql/generated/types";
import { RESTAURANT_FOR_ADMIN } from "../../graphql/queries";
import { userSignOut } from "../../redux/actions";
import { useStyles } from "./Admin.style";

const Admin = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let { path, url } = useRouteMatch();

  const { loading, error, data } = useQuery(RESTAURANT_FOR_ADMIN) as QueryResult<
    RestaurantForAdminQuery,
    RestaurantForAdminQueryVariables
  >;

  return (
    <div>
      <HeaderBar
        profilePicUrl={data?.restaurantForAdmin.logoUrl || PROFILE_PICTURE_PLACEHOLDER}
        adminName={data?.restaurantForAdmin.name || "Admin"}
      />
      <div className={classes.mainContent}>
        <Switch>
          <Route path={`${path}/edit`}>
            <AdminCreateRestaurant />
          </Route>
          <Route exact path={path}>
            {error ? (
              <Redirect to={{ pathname: `${url}/edit` }} />
            ) : (
              <div>
                <HeroImage
                  location={data?.restaurantForAdmin.heroUrl || HERO_PLACEHOLDER}
                />
                <div className={classes.menu}>
                  <div>
                    <Link to={{ pathname: `${url}/edit` }}>
                      <button>Edit restaurant details</button>
                    </Link>
                  </div>
                  <div>
                    <button>Create new Nibble</button>
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
              </div>
            )}
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Admin;
