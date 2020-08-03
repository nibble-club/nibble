import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider as JSSThemeProvider } from "react-jss";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
  InMemoryCache
} from "@apollo/client";
import Auth from "@aws-amplify/auth";
import { ThemeProvider as MUIThemeProvider } from "@material-ui/core";

import App from "./App";
import { appTheme, muiTheme } from "./common/theming";
import { authFlowLink } from "./links/auth";
import { loggerLink } from "./links/logging";
import { retryLink } from "./links/retry";
import nibbleApp from "./redux/reducers";
import * as serviceWorker from "./serviceWorker";

Auth.configure({
  mandatorySignIn: true,
  region: process.env.REACT_APP_AWS_REGION,
  userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
});

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

const link = from([retryLink, authFlowLink, loggerLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const store = createStore(nibbleApp, devToolsEnhancer({}));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <JSSThemeProvider theme={appTheme}>
          <MUIThemeProvider theme={muiTheme}>
            <ApolloProvider client={client}>
              <App />
            </ApolloProvider>
          </MUIThemeProvider>
        </JSSThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
