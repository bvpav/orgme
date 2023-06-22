import { clerkClient, type User } from "@clerk/nextjs/api";
import { asyncComponent } from "~/utils/hacks";
import { getUserDisplayName } from "~/utils/user";

export const UserButton = asyncComponent(
  async ({ userResponse }: { userResponse: User | Promise<User> }) => {
    const user = await userResponse;
    return (
      <div className="flex items-center gap-3 font-semibold">
        <img
          className="w-10 rounded-full"
          src={user.profileImageUrl}
          alt={user.username || "user profile image"}
        />{" "}
        {user.username}
      </div>
    );
  }
);

export const UserButtonById = asyncComponent(
  async ({ userId }: { userId: string }) => {
    const user = await clerkClient.users.getUser(userId);
    return (
      <div className="flex items-center gap-3 font-semibold">
        <img
          className="w-10 rounded-full"
          src={user.profileImageUrl}
          alt={user.username || "user profile image"}
        />{" "}
        {getUserDisplayName(user)}
      </div>
    );
  }
);
