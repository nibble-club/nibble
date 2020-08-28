import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { useQuery } from "@apollo/client";

import AdminEditNibble from "../../components/AdminEditNibble";
import AdminEditRestaurant from "../../components/AdminEditRestaurant";
import AdminHome from "../../components/AdminHome";
import HeaderBar from "../../components/HeaderBar";
import {
  RestaurantForAdminQuery,
  RestaurantForAdminQueryVariables
} from "../../graphql/generated/types";
import { RESTAURANT_FOR_ADMIN } from "../../graphql/queries";
import { useStyles } from "./Admin.style";

const Admin = () => {
  const classes = useStyles();
  let { path, url } = useRouteMatch();

  const { error } = useQuery<RestaurantForAdminQuery, RestaurantForAdminQueryVariables>(
    RESTAURANT_FOR_ADMIN
  );

  return (
    <div>
      <HeaderBar />
      <div className={classes.mainContent}>
        <Switch>
          <Route path={`${path}/edit_nibble/:id`}>
            <AdminEditNibble />
          </Route>
          <Route path={`${path}/edit`}>
            <AdminEditRestaurant />
          </Route>
          <Route exact path={path}>
            {error ? <Redirect to={{ pathname: `${url}/edit` }} /> : <AdminHome />}
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Admin;
