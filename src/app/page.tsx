import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "~/db";
import { posts } from "~/db/schema";

export default async function Home() {
  const publicPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.visibility, "public"))
    .orderBy(desc(posts.createdAt));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {publicPosts.map((post) => (
        <Link
          key={post.id}
          className="flex flex-col items-center justify-center"
          href={`/i/${post.id}`}
        >
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-auto w-full max-w-2xl"
          />
          <p className="text-xl">{post.description}</p>
        </Link>
      ))}
    </main>
  );
}
