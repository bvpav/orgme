"use server";

import { InferModel } from "drizzle-orm";
import invariant from "tiny-invariant";
import { utapi } from "uploadthing/server";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { getOptString } from "~/utils/form-data";
import { redirect } from "next/navigation";

export async function createPost(data: FormData) {
  const fileKey = getOptString(data, "fk");
  if (!fileKey) throw new Error("No file key");
  console.log("fileKey", fileKey);

  const title = getOptString(data, "title");
  const description = getOptString(data, "description");
  const visibility = "public";

  const images = await utapi.getFileUrls(fileKey);
  invariant(images.length === 1, "Expected exactly one image");
  const imageUrl = images[0].url;

  const id = "foo"; // TODO: generate uuid
  const post = await db.insert(posts).values({
    id, // TODO: generate uuid
    title,
    description,
    imageUrl,
    imageFK: fileKey,
    visibility,
  });
  redirect(`/i/${id}`);
}
