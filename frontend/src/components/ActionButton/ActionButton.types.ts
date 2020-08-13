import { MouseEvent, ReactNode } from "react";

export type ActionButtonProps = {
  onClick: (event: MouseEvent) => void;
  children: ReactNode;
  disabled: boolean;
  color?: string;
};
