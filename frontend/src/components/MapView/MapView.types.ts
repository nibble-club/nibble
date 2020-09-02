import { LatLon, S3Object } from "../../graphql/generated/types";

export type MapViewProps = {
  pins: MapPin[];
  activePin?: number;
  height?: string;
};

export type MapPin = {
  address: {
    location: LatLon;
  };
  name: string;
  id?: string;
  logoUrl?: S3Object;
  /** Allows you to put any random keys; these will be ignored */
  [key: string]: any;
};
