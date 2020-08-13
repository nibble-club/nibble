import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import Auth from "@aws-amplify/auth";

import { USER_TOKEN_KEY } from "../common/constants";

let isRefreshing = false;

const withToken = setContext((_, { headers, ...context }) => {
  const token = window.localStorage.getItem(USER_TOKEN_KEY);
  if (token) {
    isRefreshing = false;
    return {
      headers: {
        ...headers,
        authorization: token,
      },
      ...context,
    };
  }

  // fetch new token iff not already refreshing (if we are already refreshing, token
  // is already being fetched so we will do nothing)
  if (!isRefreshing) {
    console.log("No local token, refreshing");
    isRefreshing = true;
    return Auth.currentSession()
      .then((session) => {
        console.log("Got token!");
        const token = session.getIdToken().getJwtToken();
        window.localStorage.setItem(USER_TOKEN_KEY, token);
        return {
          headers: {
            ...headers,
            authorization: token,
          },
          ...context,
        };
      })
      .catch((reason) => {
        console.log(`Fetching current session failed: ${reason}`);
        console.log("Redirecting to /login");
        window.location.href = "/login";
      });
  }
});

const resetToken = onError(({ networkError, forward, operation }) => {
  if (
    networkError &&
    networkError.name === "ServerError" &&
    "statusCode" in networkError &&
    networkError.statusCode === 401
  ) {
    console.log("401 error");
    if (!isRefreshing) {
      console.log("Removing token on 401 error");
      window.localStorage.removeItem(USER_TOKEN_KEY);
    }
  }
  return;
});

export const authFlowLink = withToken.concat(resetToken);
