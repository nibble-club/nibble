import { FieldRenderProps } from "react-final-form";

export type TextInputProps = {
  center?: boolean;
  /** Input field background */
  background?: string;
  /** Text color */
  color?: string;
  /** Width as percentage */
} & FieldRenderProps<string, any>;
