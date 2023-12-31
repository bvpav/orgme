import { User } from "@clerk/nextjs/server";
import Link from "next/link";
import { ellipsisText, getPostTitle } from "~/utils/post";
import { cn } from "~/utils/ui";
import {
  ImageDropdownMenuRoot,
  ImageRectangle,
  ImageRectangleMenuTrigger,
  VisibilityText,
} from "../image";
import { UserLink } from "../user";

type Post = {
  id: string;
  title: string;
  imageUrl: string;
  authorId: string;
  visibility: "public" | "private" | "unlisted";
};

function isHidden(post: Post) {
  return post.visibility === "unlisted" || post.visibility === "private";
}

export const PostGrid: React.FC<{
  posts: Post[];
  getUserResponse: (post: Post) => User | Promise<User>;
  showVisibility?: boolean;
}> = ({ posts, getUserResponse, showVisibility = false }) => {
  return posts.length > 0 ? (
    <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.id}
          className={cn(
            "group flex flex-col items-center justify-start gap-2 overflow-clip rounded-md bg-gradient-to-b from-transparent via-transparent to-white/5 shadow-sm transition-transform md:hover:scale-105",
            {
              "border-2 border-dashed border-white/10 hover:border-white/20":
                isHidden(post),
            }
          )}
        >
          <ImageDropdownMenuRoot post={post}>
            <Link
              href={`/i/${post.id}`}
              className="flex w-full flex-col items-center gap-1 text-center"
            >
              <ImageRectangle
                url={post.imageUrl}
                zoomable={false}
                alt={getPostTitle(post.title)}
                menu={<ImageRectangleMenuTrigger />}
              />
              <h1
                className={cn("mt-2 text-2xl font-semibold", {
                  "opacity-50": !isHidden(post) && !post.title,
                  "opacity-20 transition-colors group-hover:opacity-50":
                    isHidden(post) && !post.title,
                  "opacity-70 transition-colors group-hover:opacity-100":
                    isHidden(post) && post.title,
                })}
              >
                {ellipsisText(getPostTitle(post.title), 18)}
              </h1>
            </Link>
          </ImageDropdownMenuRoot>
          {showVisibility && (
            <div
              className={cn("text-xs font-semibold", {
                "text-white": !isHidden(post),
                "text-gray-400 group-hover:text-white": isHidden(post),
              })}
            >
              <VisibilityText visibility={post.visibility} />
            </div>
          )}
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
