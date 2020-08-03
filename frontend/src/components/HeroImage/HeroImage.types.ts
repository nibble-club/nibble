import { S3Object } from "../../graphql/generated/types";

export type HeroImageProps =
  | {
      location: S3Object;
      /** width to height ratio; defaults to 1.5 (3:2 aspect ratio) */
      aspectRatio?: number;
      loading?: false;
    }
  | {
      loading: true;
    };
