import { getAuth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import invariant from "tiny-invariant";
import { db } from "~/db";
import { posts } from "~/db/schema";

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("i");
  if (!postId) {
    notFound();
  }
  const { userId } = getAuth(req);
  const results = await db.select().from(posts).where(eq(posts.id, postId));
  const post = results[0];
  if (!post) {
    // notFound();
    return new Response("This image does not exist.", {
      status: 404,
    });
  }
  if (post.visibility === "private" && post.authorId !== userId) {
    // notFound();
    return new Response("You do not have permission to download this image.", {
      status: 403,
    });
  }
  const s3response = await fetch(post.imageUrl);
  const headers = new Headers(s3response.headers);

  invariant(
    post.imageUrl.includes("."),
    "image url doesn't have a file extension"
  );
  const fileExtension = post.imageUrl.split(".").at(-1)!;
  const fileName = `${post.title || post.id} - OrgMe.${fileExtension}`;
  // FIXME: escape file name
  // https://stackoverflow.com/questions/93551/how-to-encode-the-filename-parameter-of-content-disposition-header-in-http
  headers.set("Content-Disposition", `attachment; filename="${fileName}"`);

  return new Response(s3response.body, {
    status: s3response.status,
    headers,
  });
}
