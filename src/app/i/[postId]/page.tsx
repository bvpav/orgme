import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { UserLinkById } from "~/components/user";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { actuallyWorkingAuth } from "~/utils/hacks";
import { PostForm } from "./components";

export const dynamic = "force-dynamic";

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
        createdAt: post.createdAt,
      }}
      authorComponent={<UserLinkById userId={post.authorId} />}
      userId={userId}
    />
  );
}
