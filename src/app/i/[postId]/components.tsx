"use client";

import { InferModel } from "drizzle-orm";
import {
  DeleteImageDialog,
  ImageDescriptionInput,
  ImageDropdownMenu,
  ImageRectangle,
  ImageRectangleMenu,
} from "~/components/image";
import { getPostTitle } from "~/utils/post";
import { deletePost, updatePost } from "./actions";
// TODO: manage to format this away w/ prettier
import { TbDots, TbEyeOff, TbLock, TbPencil, TbWorld } from "react-icons/tb";
import { formatDate } from "../../../utils/chrono";
import React, { HTMLProps, useLayoutEffect, useRef, useState } from "react";
import { title } from "process";
import clsx from "clsx";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "~/components/ui/select";
import { Eye, Globe } from "lucide-react";
import { Direction } from "@radix-ui/react-select";

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

const AutoInput = React.forwardRef<
  HTMLInputElement,
  HTMLProps<HTMLInputElement> & { onFirstUpdate?: () => void }
>(
  (
    {
      defaultValue,
      onFirstUpdate,
      value: _value,
      onChange: _onChange,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState(defaultValue);
    const [firstUpdate, setFirstUpdate] = useState(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      // if (onChange) onChange(event);
    };

    useLayoutEffect(() => {
      if (!ref || !("current" in ref) || !ref.current) return;
      if (value) {
        ref.current.style.width = "0";
        ref.current.style.width = `min(${ref.current.scrollWidth}px, 100%)`;
        if (onFirstUpdate && firstUpdate) {
          setFirstUpdate(false);
          onFirstUpdate();
        }
      } else {
        ref.current.style.width = "";
      }
    }, [value, onFirstUpdate, firstUpdate, setFirstUpdate, ref]);

    return <input ref={ref} {...props} value={value} onChange={handleChange} />;
  }
);
AutoInput.displayName = "AutoInput";

// FIXME: maybe move elsewhere??
export const VisibilitySelect: React.FC<{
  children?: React.ReactNode;
  value?: Post["visibility"];
  defaultValue?: Post["visibility"];
  onValueChange?(value: Post["visibility"]): void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  dir?: Direction;
  name?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
}> = (props) => {
  return (
    <Select {...props}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select visibility" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="public" className="flex gap-10">
          <div className="flex items-center gap-2">
            <TbWorld />
            <span>Public</span>
          </div>
        </SelectItem>
        <SelectItem value="private" className="flex gap-10">
          <div className="flex items-center gap-2">
            <TbLock />
            <span>Private</span>
          </div>
        </SelectItem>
        <SelectItem value="unlisted" className="flex gap-10">
          <div className="flex items-center gap-2">
            <TbEyeOff />
            <span>Unlisted</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export const PostForm: React.FC<{
  post: Post;
  userId: string | null;
  authorComponent: React.ReactNode;
}> = ({ post, userId, authorComponent }) => {
  const isAuthor = post.authorId === userId;

  const titleInputRef = useRef<HTMLInputElement>(null);
  // FIXME: because we can't know how wide the text field is going to be outside of
  // the browser, we're defaulting to hiding the edit button until the proper
  // width is calculated, so we can prevent it from jumping around
  const [showEdit, setShowEdit] = useState(false);

  // HACK: this is a hack to prevent the edit button from showing up when the input is empty
  const shouldShowEdit = showEdit && titleInputRef.current?.value;

  return (
    <main className="flex flex-col items-center justify-center px-3">
      <form className="flex max-w-xl flex-col gap-3" action={updatePost}>
        <input type="hidden" name="postId" value={post.id} />
        <h1 className="flex w-full items-center gap-3 text-2xl">
          <AutoInput
            ref={titleInputRef}
            className="max-w-full border-none bg-transparent font-bold placeholder-gray-400/50 outline-none placeholder:italic"
            id="title"
            name="title"
            placeholder={isAuthor ? "Add a title..." : undefined}
            defaultValue={post.title}
            disabled={!isAuthor}
            onFocus={() => setShowEdit(false)}
            onBlur={() => setShowEdit(true)}
            onFirstUpdate={() =>
              setShowEdit(document.activeElement !== titleInputRef.current)
            }
          />
          {isAuthor && (
            <label
              role="button"
              htmlFor={shouldShowEdit ? "title" : undefined}
              className={clsx("text-2xl transition-transform active:scale-95", {
                "opacity-0": !shouldShowEdit,
                "cursor-pointer": shouldShowEdit,
              })}
            >
              <TbPencil />
            </label>
          )}
        </h1>
        <p className="flex gap-2 text-sm font-light">
          <span>{`Uploaded ${formatDate(post.createdAt)}`}</span>
          {"•"}
          <span className="flex items-center gap-1">
            {post.visibility === "public" ? (
              <>
                <TbWorld /> Public
              </>
            ) : post.visibility === "private" ? (
              <>
                <TbLock /> Private
              </>
            ) : (
              <>
                <TbEyeOff /> Unlisted
              </>
            )}
          </span>
        </p>
        <div className="my-4 overflow-clip rounded-md">
          <ImageRectangle
            url={post.imageUrl}
            alt={getPostTitle(post.title)}
            menu={<ImageRectangleMenu post={post} />}
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
          <ImageDropdownMenu post={post}>
            <TbDots className="cursor-pointer text-2xl transition-transform active:scale-95" />
          </ImageDropdownMenu>
        </div>
        {!isAuthor && <p className="whitespace-pre-wrap">{post.description}</p>}
        {isAuthor && (
          <fieldset className="mb-4 flex flex-col gap-3 border-y border-white/20 py-5">
            <p className="text-xl font-semibold">Change visibility</p>
            <p>
              <VisibilitySelect
                name="visibility"
                defaultValue={post.visibility}
              />
            </p>
          </fieldset>
        )}
        {isAuthor && (
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="submit">
              Save changes
            </Button>
            <DeleteImageDialog post={post}>
              <Button variant="destructive" form="delete-form">
                Delete image
              </Button>
            </DeleteImageDialog>
          </div>
        )}
      </form>
      {isAuthor && (
        <form action={deletePost} name="delete-form">
          <input type="hidden" name="postId" value={post.id} />
        </form>
      )}
    </main>
  );
};
