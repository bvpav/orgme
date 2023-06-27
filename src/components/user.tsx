import { clerkClient, type User } from "@clerk/nextjs/api";
import Link from "next/link";
import { asyncComponent } from "~/utils/hacks";
import { getPublicUserId, getUserDisplayName } from "~/utils/user";

export const UserLink = asyncComponent(
  async ({ userResponse }: { userResponse: User | Promise<User> }) => {
    const user = await userResponse;
    return (
      <Link
        href={`/user/${getPublicUserId(user.id)}`}
        className="flex items-center gap-3 font-semibold"
      >
        <img
          className="w-10 rounded-full"
          src={user.profileImageUrl}
          alt={user.username || "user profile image"}
        />{" "}
        {getUserDisplayName(user)}
      </Link>
    );
  }
);

export const UserLinkById = asyncComponent(
  async ({ userId }: { userId: string }) => (
    <UserLink userResponse={await clerkClient.users.getUser(userId)} />
  )
);
