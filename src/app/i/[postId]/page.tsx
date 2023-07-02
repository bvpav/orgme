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
import { cache } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { getPostTitle } from "~/utils/post";

export const dynamic = "force-dynamic";

type Props = {
  params: { postId: string };
};

const getPost = cache(async (postId: string) => {
  const results = await db.select().from(posts).where(eq(posts.id, postId));
  if (!results.length) return null;
  return results[0];
});

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPost(params.postId);
  // FIXME: idk how to handle this case
  if (!post || post.visibility === "private") return {};

  return {
    title: `${getPostTitle(post.title)} - OrgMe`,
    description: post.description || undefined,
    openGraph: {
      title: `${getPostTitle(post.title)} - OrgMe`,
      description: post.description || undefined,
      images: [
        {
          url: post.imageUrl,
          alt: getPostTitle(post.title),
        },
      ],
    },
    robots: post.visibility === "public" ? "index" : "noindex",
  };
}

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

export default async function PostDetails({ params }: Props) {
  const post = await getPost(params.postId);
  if (!post) notFound();

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
