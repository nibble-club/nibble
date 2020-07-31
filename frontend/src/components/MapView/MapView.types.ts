import { LatLon } from "../../graphql/generated/types";

export type MapViewProps = {
  pins: MapPin[];
  activePin?: number;
  height?: number;
};

export type MapPin = {
  address: {
    location: LatLon;
  };
  name: string;
};
