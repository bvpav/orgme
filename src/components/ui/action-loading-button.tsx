"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { ButtonProps } from "./button";
import { LoadingButton } from "./loading-button";

export const ActionLoadingButton: React.FC<
  ButtonProps & {
    loadingContent?: React.ReactNode;
  }
> = ({ ...props }) => {
  const { pending } = useFormStatus();
  return <LoadingButton {...props} loading={pending} />;
};
