import { S3Object } from "../../graphql/generated/types";

export type LabeledInputProps = {
  label: string;
  children: React.ReactNode;
  /** Input width as a percentage */
  inputWidth?: number;
  explanation?: string;
  imageToPreview?: {
    location: S3Object;
    width: number;
    height: number;
  };
  error?: string;
  showError?: boolean;
  /** Whether to align label at top; otherwise will be aligned at center */
  alignLabelTop?: boolean;
};
