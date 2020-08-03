import { FieldRenderProps } from "react-final-form";

export type TextInputProps = {
  center?: boolean;
  /** Input field background */
  background?: string;
  /** Text color */
  color?: string;
  datetimeOptions?: {
    disablePast?: boolean;
    disableFuture?: boolean;
  };
} & FieldRenderProps<any, any>;
