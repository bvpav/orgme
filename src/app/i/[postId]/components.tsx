"use client";

import { InferModel } from "drizzle-orm";
import { updatePost } from "./actions";

type Post = Pick<
  InferModel<typeof import("~/db/schema").posts>,
  "id" | "title" | "imageUrl" | "description" | "visibility" | "authorId"
>;

export const PostForm: React.FC<{
  post: Post;
  userId: string | null;
}> = ({ post, userId }) => {
  const isAuthor = post.authorId === userId;

  return (
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
      <img src={post.imageUrl} alt={post.title} className="max-w-lg" />
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
      {isAuthor && (
        <form>
          <input type="hidden" name="postId" value={post.id} />
          <button
            type="button"
            className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
            onClick={() => alert("TODO: implement")}
          >
            Delete post
          </button>
        </form>
      )}
    </form>
  );
};
