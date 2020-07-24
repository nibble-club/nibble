import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import Auth from "@aws-amplify/auth";

import { USER_TOKEN_KEY } from "./common/constants";
import { globalTheme } from "./common/theming";
import { AppTheme } from "./common/theming.types";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import { userSignIn } from "./redux/actions";

const useStyles = createUseStyles((theme: AppTheme) => ({
  ...globalTheme(theme),
  app: {},
}));

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // checks if user is logged in
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const session = await Auth.currentSession();
        window.localStorage.setItem(USER_TOKEN_KEY, session.getIdToken().getJwtToken());
        dispatch(userSignIn(user.attributes.email, user.username));
        setLoading(false);
      } catch (err) {
        console.log("User not authenticated");
        setLoading(false);
        setLoggedIn(false);
      }
    };
    getUser();
  });
  const classes = useStyles();
  return loading ? (
    <div></div>
  ) : (
    <div className={classes.app}>
      <Switch>
        <Route path="/login">
          <Login setLoggedIn={setLoggedIn} />
        </Route>

        <Route path="/nibble/:id"></Route>
        <Route path="/restaurant/:id"></Route>
        <Route path="/profile"></Route>
        <Route path="/admin"></Route>
        <Route path="/">
          {loggedIn ? (
            <Home />
          ) : (
            <Redirect to={{ pathname: "/login", state: { referrer: "/" } }} />
          )}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
