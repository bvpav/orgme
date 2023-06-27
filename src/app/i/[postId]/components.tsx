"use client";

import { InferModel } from "drizzle-orm";
import { ImageDescriptionInput, ImageRectangle } from "~/components/image";
import { getPostTitle } from "~/utils/post";
import { updatePost } from "./actions";
// TODO: manage to format this away w/ prettier
import { TbDots, TbEyeOff, TbLock, TbWorld } from "react-icons/tb";
import { formatDate } from "../../../utils/chrono";

type Post = Pick<
  InferModel<typeof import("~/db/schema").posts>,
  | "id"
  | "title"
  | "imageUrl"
  | "description"
  | "visibility"
  | "authorId"
  | "createdAt"
>;

export const PostForm: React.FC<{
  post: Post;
  userId: string | null;
  authorComponent: React.ReactNode;
}> = ({ post, userId, authorComponent }) => {
  const isAuthor = post.authorId === userId;

  return (
    <main className="flex flex-col items-center justify-center px-3">
      <form className="flex max-w-xl flex-col gap-3" action={updatePost}>
        <input type="hidden" name="postId" value={post.id} />
        <h1>
          <input
            className="w-full border-none bg-transparent text-2xl font-bold placeholder-gray-400/50 outline-none placeholder:italic"
            name="title"
            placeholder={isAuthor ? "Add a title..." : undefined}
            defaultValue={post.title}
            disabled={!isAuthor}
          />
        </h1>
        <p className="flex gap-2 text-sm font-light">
          <span>{`Uploaded ${formatDate(post.createdAt)}`}</span>
          {"•"}
          {post.visibility === "public" ? (
            <span className="flex items-center gap-1">
              <TbWorld /> Public
            </span>
          ) : post.visibility === "private" ? (
            <span className="flex items-center gap-1">
              <TbLock /> Private
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <TbEyeOff /> Unlisted
            </span>
          )}
        </p>
        <div className="my-4 overflow-clip rounded-md">
          <ImageRectangle
            url={post.imageUrl}
            alt={getPostTitle(post.title)}
            menu={"TODO"}
          />
          {isAuthor && (
            <ImageDescriptionInput
              name="description"
              defaultValue={post.description}
            />
          )}
        </div>
        <div className="mb-5 flex w-full items-center justify-between">
          {authorComponent}
          <TbDots className="cursor-pointer text-2xl transition-transform active:scale-95" />
        </div>
        {!isAuthor && <p className="whitespace-pre-wrap">{post.description}</p>}
        {isAuthor && (
          <fieldset className="mb-4 flex flex-col gap-3 border-y border-white/20 py-5">
            <p className="text-xl font-semibold">Change visibility</p>
            <p>
              <select
                name="visibility"
                defaultValue={post.visibility}
                className="cursor-pointer rounded bg-white/10 px-4 py-2 pr-8 focus:border-white focus:outline-none"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </p>
          </fieldset>
        )}
        {isAuthor && (
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="rounded-md bg-white/10 px-4 py-2 font-semibold text-white transition-colors hover:bg-white/20"
            >
              Save changes
            </button>
            <button className="rounded-md bg-red-500 px-4 py-2 font-bold text-white transition-colors hover:bg-red-700">
              Delete post
            </button>
          </div>
        )}
      </form>
      {/* {isAuthor && (
        <form action={deletePost}>
          <input type="hidden" name="postId" value={post.id} />
          <button className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">
            Delete post
          </button>
        </form>
      )} */}
    </main>
  );
};
