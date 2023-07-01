import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { clerkClient } from "@clerk/nextjs/api";
import invariant from "tiny-invariant";
import { UserLink } from "~/components/user";
import { ImageRectangle, ImageRectangleMenu } from "~/components/image";
import { getPostTitle } from "~/utils/post";
import { PostGrid } from "~/components/server/image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "OrgMe - The comfiest image sharing platform",
  description: `OrgMe is the comfiest image sharing platform. Upload your images and share them with the world.

  OrgMe is my application to enter the organization team of HackTUES 10 - the 10th edition of the biggest hackathon in Bulgaria, organized by students for students, as well as TUES Fest 2024 - the open doors event of the Technological School "Electronic Systems" in Sofia, Bulgaria.`,
};

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
    <main className="flex min-h-screen flex-col items-center justify-between px-3 py-24">
      <PostGrid
        posts={publicPosts}
        getUserResponse={(post) => getUser(post.authorId)}
      />
    </main>
  );
}
