"use server";

import { getAuth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import invariant from "tiny-invariant";
import { utapi } from "uploadthing/server";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { getOptString } from "~/utils/form-data";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

// HACK: clerk is fucking dogshit and its library functions dont work
//       so here's me rewriting them:
function actuallyWorkingAuth() {
  const request = new NextRequest("https://hacktues.bg", {
    headers: headers(),
  });
  return getAuth(request);
}

export async function createPost(data: FormData) {
  const { userId } = actuallyWorkingAuth();
  if (!userId) throw new Error("Not logged in");

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
