import { ReactElement } from "react";

export function asyncComponent<TProps>(
  component: (props: TProps) => Promise<ReactElement>
) {
  return component as any as React.FC<TProps>;
}
