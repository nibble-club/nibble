import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { QueryResult, useQuery } from "@apollo/client";

import AdminEditNibble from "../../components/AdminEditNibble";
import AdminEditRestaurant from "../../components/AdminEditRestaurant";
import AdminHome from "../../components/AdminHome";
import HeaderBar from "../../components/HeaderBar";
import HeroImage from "../../components/HeroImage/HeroImage";
import { PROFILE_PICTURE_PLACEHOLDER } from "../../components/S3Image/S3Image";
import {
  RestaurantForAdminQuery,
  RestaurantForAdminQueryVariables,
  RestaurantInfoFragment
} from "../../graphql/generated/types";
import { RESTAURANT_FOR_ADMIN } from "../../graphql/queries";
import { useStyles } from "./Admin.style";

const Admin = () => {
  const classes = useStyles();
  let { path, url } = useRouteMatch();

  const { loading, error, data, refetch } = useQuery(
    RESTAURANT_FOR_ADMIN
  ) as QueryResult<RestaurantForAdminQuery, RestaurantForAdminQueryVariables>;

  return (
    <div>
      <HeaderBar
        profilePicUrl={data?.restaurantForAdmin.logoUrl || PROFILE_PICTURE_PLACEHOLDER}
        adminName={data?.restaurantForAdmin.name || "Admin"}
      />
      <div className={classes.mainContent}>
        <Switch>
          <Route path={`${path}/edit_nibble/:id`}>
            <AdminEditNibble />
          </Route>
          <Route path={`${path}/edit`}>
            <AdminEditRestaurant onSuccess={refetch} />
          </Route>
          <Route exact path={path}>
            {loading ? (
              <HeroImage loading={true} />
            ) : error ? (
              <Redirect to={{ pathname: `${url}/edit` }} />
            ) : (
              <AdminHome
                restaurant={data?.restaurantForAdmin as RestaurantInfoFragment}
              />
            )}
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Admin;