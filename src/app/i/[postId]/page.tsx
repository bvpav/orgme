import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { actuallyWorkingAuth } from "~/utils/clerk";

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
    <div>
      <h1>{post.title}</h1>
      <img src={post.imageUrl} alt={post.title} />
      <p>{post.description}</p>
    </div>
  );
}
