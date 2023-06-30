import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { clerkClient } from "@clerk/nextjs/api";
import invariant from "tiny-invariant";
import { UserLink } from "~/components/user";
import { ImageRectangle, ImageRectangleMenu } from "~/components/image";
import { getPostTitle } from "~/utils/post";

export const dynamic = "force-dynamic";

export default async function Home() {
  const publicPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.visibility, "public"))
    .orderBy(desc(posts.createdAt));
  const usersPromise = clerkClient.users
    .getUserList({
      userId: publicPosts.map((post) => post.authorId),
    })
    .then((users) =>
      users.reduce((acc, user) => {
        acc.set(user.id, user);
        return acc;
      }, new Map<string, (typeof users)[number]>())
    );
  const getUser = async (userId: string) => {
    const users = await usersPromise;
    const user = users.get(userId);
    invariant(user, "User not found");
    return user;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {publicPosts.length > 0 ? (
        publicPosts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col items-center justify-center"
          >
            <Link href={`/i/${post.id}`}>
              <h1 className="text-4xl font-bold">{post.title}</h1>
              <ImageRectangle
                url={post.imageUrl}
                zoomable={false}
                alt={getPostTitle(post.title)}
                menu={<ImageRectangleMenu post={post} />}
              />
            </Link>
            <UserLink userResponse={getUser(post.authorId)} />
            <p className="text-xl">{post.description}</p>
          </article>
        ))
      ) : (
        <h1 className="text-4xl font-bold">No posts yet</h1>
      )}
    </main>
  );
}
