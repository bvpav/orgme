import Link from "next/link";
import { clerkClient } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ImageRectangle, ImageRectangleMenu } from "~/components/image";
import { UserLink } from "~/components/user";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { getPostTitle } from "~/utils/post";
import { getClerkUserId, getUserDisplayName } from "~/utils/user";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";

type Props = {
  params: { userId: string };
};

const loadUser = cache(async (publicUserId: string) => {
  const clerkUserId = getClerkUserId(publicUserId);
  const user = await clerkClient.users.getUser(clerkUserId);
  return user;
});

export async function generateMetadata(
  { params }: Props,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const user = await loadUser(params.userId);
  return {
    title: `${getUserDisplayName(user)}'s images - OrgMe`,
    openGraph: {
      title: `${getUserDisplayName(user)}'s images - OrgMe`,
      description: `Images uploaded by ${getUserDisplayName(user)} on OrgMe.`,
      creators: [getUserDisplayName(user)],
      images: [
        {
          url: user.profileImageUrl,
          alt: getUserDisplayName(user),
        },
      ],
    },
  };
}

export default async function UserPage({ params }: Props) {
  const clerkUserId = getClerkUserId(params.userId);
  const [user, userPosts] = await Promise.all([
    loadUser(params.userId).catch(notFound),
    db
      .select()
      .from(posts)
      .where(
        and(eq(posts.authorId, clerkUserId), eq(posts.visibility, "public"))
      ),
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative aspect-square w-full max-w-xs overflow-clip rounded-full">
        <Image fill src={user.profileImageUrl} alt={getUserDisplayName(user)} />
      </div>
      <h1 className="text-4xl font-bold">{getUserDisplayName(user)}</h1>
      {userPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {userPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col items-center justify-center"
            >
              <h1 className="text-4xl font-bold">{post.title}</h1>
              <Link href={`/i/${post.id}`}>
                <ImageRectangle
                  url={post.imageUrl}
                  zoomable={false}
                  alt={getPostTitle(post.title)}
                  menu={<ImageRectangleMenu post={post} />}
                />
              </Link>
              <UserLink userResponse={user} />
              <p className="text-xl">{post.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <h1 className="text-4xl font-bold">No posts yet</h1>
      )}
    </main>
  );
}
