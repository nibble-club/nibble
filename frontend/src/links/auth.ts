import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import Auth from "@aws-amplify/auth";

import { USER_TOKEN_KEY } from "../common/constants";

const withToken = setContext((_, { headers, ...context }) => {
  const token = window.localStorage.getItem(USER_TOKEN_KEY);
  if (token) {
    return {
      headers: {
        ...headers,
        authorization: token,
      },
      ...context,
    };
  }

  console.log("No local token, refreshing");
  Auth.currentSession()
    .then(session => {
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
    .catch(reason => {
      console.log(`Fetching current session failed: ${reason}`);
      console.log("Redirecting to /login");
      window.location.href = "/login";
    });
});

const resetToken = onError(({ networkError }) => {
  const error = {
    statusCode: 0,
    ...networkError,
  };
  if (networkError && networkError.name === "ServerError" && error.statusCode === 401) {
    console.log("Removing token on 401 error");
    window.localStorage.removeItem(USER_TOKEN_KEY);
  }
});

export const authFlowLink = withToken.concat(resetToken);
