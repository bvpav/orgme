import { clerkClient } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { redirect, usePathname } from "next/navigation";
import { ImageRectangle, ImageRectangleMenu } from "~/components/image";
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
      <h1 className="text-2xl font-bold">Your images</h1>
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <ImageRectangle
              url={post.imageUrl}
              zoomable={false}
              alt={getPostTitle(post.title)}
              menu={<ImageRectangleMenu post={post} />}
            />
            <UserLink userResponse={userResponse} />
            <p className="text-xl">{post.description}</p>
          </article>
        ))
      ) : (
        <h1 className="text-4xl font-bold">No posts yet</h1>
      )}
    </main>
  );
}
