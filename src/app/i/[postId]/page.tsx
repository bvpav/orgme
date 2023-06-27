import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { TbLock } from "react-icons/tb";
import { UserLinkById } from "~/components/user";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { actuallyWorkingAuth } from "~/utils/hacks";
import { PostForm } from "./components";
import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PrivatePage = () => (
  <main className="grid w-full place-items-center px-3">
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-8 rounded-md bg-white/10 py-8">
      <TbLock className="text-8xl text-white" />
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-2 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Private image</h1>
        <p>Only the author of this image can view it.</p>
        <SignedOut>
          <p className="text-sm">
            <Link className="underline hover:font-semibold" href="/sign-in">
              Sign in
            </Link>{" "}
            to view this image.
          </p>
        </SignedOut>
      </div>
    </div>
  </main>
);

export default async function PostDetails({
  params,
}: {
  params: { postId: string };
}) {
  const results = await db
    .select()
    .from(posts)
    .where(eq(posts.id, params.postId));
  if (!results.length) notFound();

  const post = results[0];
  const { userId } = actuallyWorkingAuth();

  if (post.visibility === "private" && post.authorId !== userId) {
    return <PrivatePage />;
  }

  return (
    <PostForm
      post={{
        id: post.id,
        title: post.title,
        imageUrl: post.imageUrl,
        description: post.description,
        visibility: post.visibility,
        authorId: post.authorId,
        createdAt: post.createdAt,
      }}
      authorComponent={<UserLinkById userId={post.authorId} />}
      userId={userId}
    />
  );
}
