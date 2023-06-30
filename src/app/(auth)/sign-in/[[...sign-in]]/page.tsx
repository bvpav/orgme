import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Sign in - OrgMe",
};

export default function Page() {
  return <SignIn />;
}
