import { S3ObjectDestination, S3ObjectInput } from "../../graphql/generated/types";

export type S3ImageUploadProps = {
  setImageLocation: React.Dispatch<React.SetStateAction<S3ObjectInput>>;
  destination: S3ObjectDestination;
};
