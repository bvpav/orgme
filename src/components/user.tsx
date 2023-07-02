import { clerkClient, type User } from "@clerk/nextjs/api";
import Image from "next/image";
import Link from "next/link";
import { asyncComponent } from "~/utils/hacks";
import { getPublicUserId, getUserDisplayName } from "~/utils/user";
import { Button } from "./ui/button";

export const UserLink = asyncComponent(
  async ({ userResponse }: { userResponse: User | Promise<User> }) => {
    const user = await userResponse;
    return (
      <Link
        href={`/user/${getPublicUserId(user.id)}`}
        className="flex items-center gap-3 rounded-md p-1 ps-0 font-semibold transition-colors hover:bg-white/10"
      >
        <div className="relative h-10 w-10 overflow-clip rounded-full">
          <Image
            fill
            src={user.profileImageUrl}
            alt={user.username || "user profile image"}
          />
        </div>{" "}
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
