import { clerkClient } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { redirect, usePathname } from "next/navigation";
import { ImageRectangle, ImageRectangleMenu } from "~/components/image";
import { PostGrid } from "~/components/server/image";
import { UserLink } from "~/components/user";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { actuallyWorkingAuth } from "~/utils/hacks";
import { getPostTitle } from "~/utils/post";

export const metadata = {
  title: "OrgMe - Your images",
};

export default async function MyPostsPage() {
  const { userId, user } = actuallyWorkingAuth();
  if (!userId) redirect("/sign-in");

  const [userPosts, userResponse] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(eq(posts.authorId, userId))
      .orderBy(desc(posts.createdAt)),
    user || clerkClient.users.getUser(userId),
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="mb-5 text-4xl font-bold">Your images</h1>
      <PostGrid posts={userPosts} getUserResponse={() => userResponse} />
    </main>
  );
}
