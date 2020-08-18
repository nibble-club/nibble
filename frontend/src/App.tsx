import mapboxgl from "mapbox-gl";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import Auth from "@aws-amplify/auth";

import { USER_TOKEN_KEY } from "./common/constants";
import { globalTheme } from "./common/theming/theming";
import { AppTheme } from "./common/theming/theming.types";
import LoadingOverlay from "./components/LoadingOverlay";
import NotificationBar from "./components/NotificationBar/NotificationBar";
import Admin from "./pages/Admin/Admin";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import NibbleDetail from "./pages/NibbleDetail/NibbleDetail";
import Profile from "./pages/Profile";
import RestaurantDetail from "./pages/RestaurantDetail";
import RestaurantsMapView from "./pages/RestaurantsMapView/RestaurantsMapView";
import Search from "./pages/Search/Search";
import { userPostalCode, userSignIn } from "./redux/actions";
import { RootState } from "./redux/reducers";

const useStyles = createUseStyles((theme: AppTheme) => ({
  ...globalTheme(theme),
  app: {
    paddingBottom: `calc(10 * ${theme.spacing.large})`,
  },
}));

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const admin = useSelector((state: RootState) => state.user.admin);

  // checks if user is logged in
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const session = await Auth.currentSession();
        window.localStorage.setItem(USER_TOKEN_KEY, session.getIdToken().getJwtToken());
        dispatch(
          userSignIn(
            user.attributes.email,
            user.username,
            user.attributes["custom:admin"] === "true"
          )
        );
        dispatch(userPostalCode(user.attributes["custom:postal_code"]));
        if (window.location.href.includes("/login")) {
          console.log("Redirecting user to home page");
          window.location.href = "/";
        }
        setLoading(false);
        mapboxgl.prewarm();
      } catch (err) {
        console.log("User not authenticated");
        setLoading(false);
      }
    };
    getUser();
  }, [dispatch]);
  const classes = useStyles();
  return loading ? (
    <div>
      <LoadingOverlay show />
    </div>
  ) : (
    <div className={classes.app}>
      <NotificationBar />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>

        <Route path="/nibble/:id">
          <NibbleDetail />
        </Route>

        <Route path="/restaurants">
          <RestaurantsMapView />
        </Route>

        <Route path="/restaurant/:id">
          <RestaurantDetail />
        </Route>

        <Route path="/search">
          <Search />
        </Route>

        <Route path="/profile">
          <Profile />
        </Route>

        <Route path="/admin">
          {!admin ? <Redirect to={{ pathname: "/" }} /> : <Admin />}
        </Route>

        <Route path="/">
          {admin ? <Redirect to={{ pathname: "/admin" }} /> : <Home />}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
