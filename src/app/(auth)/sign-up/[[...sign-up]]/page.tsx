import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Sign up - OrgMe",
};

export default function Page() {
  return <SignUp />;
}
