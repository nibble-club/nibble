import { ApolloLink } from "@apollo/client";

export const loggerLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((result) => {
    if (process.env.REACT_APP_DEBUG_GRAPHQL) {
      console.groupCollapsed(`GraphQL: ${operation.operationName}`);
      console.log("Variables:");
      console.log(operation.variables);
      console.log("Result");
      console.log(result);
      console.groupEnd();
    }
    return result;
  });
});
