import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { actuallyWorkingAuth } from "~/utils/clerk";
import { PostForm } from "./components";
import { clerkClient } from "@clerk/nextjs/api";

export const dynamic = "force-dynamic";

const AuthorCard = async ({ authorId }: { authorId: string }) => {
  const user = await clerkClient.users.getUser(authorId);
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
};

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
    return <div>Private image, sorry bro 💀</div>;
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
      }}
      authorComponent={
        // @ts-expect-error async component
        <AuthorCard authorId={post.authorId} />
      }
      userId={userId}
    />
  );
}
