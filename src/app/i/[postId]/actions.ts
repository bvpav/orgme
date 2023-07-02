"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { getOptString } from "~/utils/form-data";
import { actuallyWorkingAuth } from "~/utils/hacks";
import { zact } from "zact/server";
import { z } from "zod";

export async function updatePost(data: FormData) {
  const { userId } = actuallyWorkingAuth();
  if (!userId) throw new Error("Invalid userId");

  const postId = getOptString(data, "postId");
  if (!postId) throw new Error("Permission denied");
  const title = getOptString(data, "title");
  const description = getOptString(data, "description");
  const visibility = getOptString(data, "visibility");
  if (
    visibility !== "public" &&
    visibility !== "private" &&
    visibility !== "unlisted"
  ) {
    throw new Error("Invalid visibility");
  }

  const result = await db
    .update(posts)
    .set({
      title,
      description,
      visibility,
    })
    .where(and(eq(posts.id, postId), eq(posts.authorId, userId)));
  if (result.rowsAffected !== 1) throw new Error("Invalid postId");

  revalidatePath(`/i/${postId}`);
}
export const deletePost = zact(
  z.object({
    postId: z.string().nonempty(),
  })
)(async ({ postId }) => {
  const { userId } = actuallyWorkingAuth();
  if (!userId) throw new Error("Permission denied");

  const result = await db
    .delete(posts)
    .where(and(eq(posts.id, postId), eq(posts.authorId, userId)));
  if (result.rowsAffected !== 1) throw new Error("Invalid postId");

  // TODO: delete image from uploadthing
  // TODO: use deletedAt instead of deleting

  return { success: true };
});
