import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, Route, Switch } from "react-router-dom";

import Auth from "@aws-amplify/auth";

import { USER_TOKEN_KEY } from "./common/constants";
import { globalTheme } from "./common/theming";
import { AppTheme } from "./common/theming.types";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import { userSignIn, userSignOut } from "./redux/actions";
import { RootState } from "./redux/reducers";

const useStyles = createUseStyles((theme: AppTheme) => ({
  ...globalTheme(theme),
  app: {},
}));

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
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
        if (window.location.href.includes("/login")) {
          console.log("Redirecting user to home page");
          window.location.href = "/";
        }
        setLoading(false);
      } catch (err) {
        console.log("User not authenticated");
        setLoading(false);
        setLoggedIn(false);
      }
    };
    getUser();
  }, [dispatch]);
  const classes = useStyles();
  return loading ? (
    <div />
  ) : (
    <div className={classes.app}>
      <Switch>
        <Route path="/login">
          <Login setLoggedIn={setLoggedIn} />
        </Route>

        <Route path="/nibble/:id"></Route>
        <Route path="/restaurant/:id"></Route>
        <Route path="/profile">
          <div>Hello from profile page!</div>
        </Route>
        <Route path="/admin">
          <div>
            <div>Hello from admin page!</div>{" "}
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
        </Route>
        <Route path="/">
          {loggedIn && admin ? (
            <Redirect to={{ pathname: "/admin" }} />
          ) : loggedIn ? (
            <Home />
          ) : (
            <div />
            // <Redirect to={{ pathname: "/login", state: { referrer: "/" } }} />
          )}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
