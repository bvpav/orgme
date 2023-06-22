"use client";

import { InferModel } from "drizzle-orm";
import { deletePost, updatePost } from "./actions";
import { ImageRectangle } from "~/components/image";
import { getPostTitle } from "~/utils/posts";

type Post = Pick<
  InferModel<typeof import("~/db/schema").posts>,
  "id" | "title" | "imageUrl" | "description" | "visibility" | "authorId"
>;

export const PostForm: React.FC<{
  post: Post;
  userId: string | null;
  authorComponent: React.ReactNode;
}> = ({ post, userId, authorComponent }) => {
  const isAuthor = post.authorId === userId;

  return (
    <div>
      <form action={updatePost}>
        <input type="hidden" name="postId" value={post.id} />
        {isAuthor ? (
          <h1>
            <input
              className="text-black"
              name="title"
              placeholder="Add title..."
              defaultValue={post.title}
            />
          </h1>
        ) : (
          <h1>{post.title}</h1>
        )}
        <ImageRectangle
          url={post.imageUrl}
          alt={getPostTitle(post.title)}
          menu={"TODO"}
        />
        {authorComponent}
        {isAuthor ? (
          <p>
            <textarea
              className="text-black"
              name="description"
              placeholder="Add description..."
              defaultValue={post.description}
            />
          </p>
        ) : (
          <p>{post.description}</p>
        )}
        {isAuthor ? (
          <p>
            <select
              name="visibility"
              defaultValue={post.visibility}
              className="rounded border border-gray-300 bg-white px-4 py-2 pr-8 text-black focus:border-blue-500 focus:outline-none"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
            </select>
          </p>
        ) : (
          // XXX: pointless
          <p>{post.visibility}</p>
        )}
        {isAuthor && (
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Save changes
          </button>
        )}
      </form>
      {isAuthor && (
        <form action={deletePost}>
          <input type="hidden" name="postId" value={post.id} />
          <button className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">
            Delete post
          </button>
        </form>
      )}
    </div>
  );
};
