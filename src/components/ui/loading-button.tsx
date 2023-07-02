import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./button";

export const LoadingButton: React.FC<
  ButtonProps & {
    loading?: boolean;
    loadingContent?: React.ReactNode;
  }
> = ({
  loading,
  loadingContent = "Loading...",
  children,
  disabled,
  ...props
}) => (
  <Button {...props} disabled={loading || disabled}>
    {loading ? (
      <>
        <Loader2 className="mr-2 animate-spin" /> {loadingContent}
      </>
    ) : (
      children
    )}
  </Button>
);
