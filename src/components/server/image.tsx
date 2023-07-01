import Link from "next/link";
import { ImageRectangle, ImageRectangleMenu } from "../image";
import { getPostTitle } from "~/utils/post";
import { cn } from "~/utils/ui";
import { UserLink } from "../user";
import { User } from "@clerk/nextjs/server";

type Post = {
  id: string;
  title: string;
  imageUrl: string;
  authorId: string;
};

export const PostGrid: React.FC<{
  posts: Post[];
  getUserResponse: (post: Post) => User | Promise<User>;
}> = ({ posts, getUserResponse }) => {
  return posts.length > 0 ? (
    <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.id}
          className="flex flex-col items-center justify-start gap-2 overflow-clip rounded-md bg-gradient-to-b from-transparent via-transparent to-white/5 shadow-sm transition-transform md:hover:scale-105"
        >
          <Link
            href={`/i/${post.id}`}
            className="flex w-full flex-col items-center gap-1 text-center"
          >
            <ImageRectangle
              url={post.imageUrl}
              zoomable={false}
              alt={getPostTitle(post.title)}
              menu={<ImageRectangleMenu post={post} />}
            />
            <h1
              className={cn("text-2xl font-semibold", {
                "opacity-50": !post.title,
              })}
            >
              {getPostTitle(post.title)}
            </h1>
          </Link>
          <div className="mb-2">
            <UserLink userResponse={getUserResponse(post)} />
          </div>
        </article>
      ))}
    </div>
  ) : (
    <h1 className="text-4xl font-bold opacity-70">No images yet</h1>
  );
};
