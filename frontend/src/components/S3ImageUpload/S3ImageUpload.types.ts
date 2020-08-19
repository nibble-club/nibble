import { S3ObjectDestination, S3ObjectInput } from "../../graphql/generated/types";

export type S3ImageUploadProps = {
  setImageLocation: React.Dispatch<React.SetStateAction<S3ObjectInput>>;
  destination: S3ObjectDestination;
  /**
   * If component has children, it will just render the children; clicking on or
   * dragging a picture on to the children will upload the picture as usual.
   */
  children?: React.ReactNode;
};
