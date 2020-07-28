import { ApolloError } from "@apollo/client";

export type QueryFor<T> = {
  loading: boolean;
  error?: ApolloError;
  data?: T;
};
