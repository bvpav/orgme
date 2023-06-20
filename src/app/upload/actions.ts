"use server";

import { auth } from "@clerk/nextjs";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import invariant from "tiny-invariant";
import { utapi } from "uploadthing/server";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { getOptString } from "~/utils/form-data";
import { headers } from "next/headers";

export async function createPost(data: FormData) {
  const { userId } = auth();
  if (!userId) throw new Error("Not logged in");

  // console.log(headers());

  // const userId = "TODO";

  const fileKey = getOptString(data, "fk");
  if (!fileKey) throw new Error("No file key");
  console.log("fileKey", fileKey);

  const title = getOptString(data, "title");
  const description = getOptString(data, "description");
  const visibility = "public";

  const images = await utapi.getFileUrls(fileKey);
  invariant(images.length === 1, "Expected exactly one image");
  const imageUrl = images[0].url;

  const id = nanoid(7);
  const post = await db.insert(posts).values({
    id,
    title,
    description,
    imageUrl,
    imageFK: fileKey,
    visibility,
    authorId: userId,
  });
  redirect(`/i/${id}`);
}
