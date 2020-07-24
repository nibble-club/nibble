import { ApolloError } from "@apollo/client";

export type QueryOf<T> = {
  loading: boolean;
  error?: ApolloError;
  data?: T;
};
