import { S3Object } from "../../graphql/generated/types";

export type S3ImageProps = {
  location: S3Object;
  alt: string;
  [key: string]: any;
};
