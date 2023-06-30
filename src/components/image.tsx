"use client";

import clsx from "clsx";
import React, {
  PropsWithChildren,
  TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { TbDots, TbDownload, TbFlag, TbLink, TbTrash } from "react-icons/tb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuTriggerProps } from "@radix-ui/react-dropdown-menu";
import { useUser } from "@clerk/nextjs";
import invariant from "tiny-invariant";

type Post = {
  id: string;
  authorId: string;
  imageUrl: string;
  title: string;
  // FIXME: dont overfetch :(
  // imageFK: never;
};

export const ImageRectangleMenu: React.FC<{
  post: Post;
}> = ({ post }) => {
  return (
    <ImageDropdownMenu
      post={post}
      className="absolute right-0 top-0 mr-3 mt-3 grid aspect-square place-items-center rounded bg-black/30 text-2xl transition-transform active:scale-95"
    >
      <TbDots />
    </ImageDropdownMenu>
  );
};

export const ImageRectangle: React.FC<{
  url: string;
  zoomable?: boolean;
  alt: string;
  menu?: React.ReactNode;
}> = ({ url, zoomable = true, alt, menu }) => {
  return (
    <div className="relative flex h-full min-h-[350px] w-full items-center overflow-clip rounded-t-md bg-black/30 object-cover">
      <img src={url} alt={alt} className="w-full" />
      <div
        className={clsx(
          "group absolute top-0 h-full w-full bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-0 transition-opacity hover:opacity-100",
          zoomable ? "cursor-zoom-in" : "cursor-pointer"
        )}
      >
        {menu}
      </div>
      {/* <Image
        src={url}
        alt="the image to be uploaded"
        fill
        className="object-cover"
      /> */}
    </div>
  );
};

const AutoTextarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  defaultValue,
  // FIXME: ignoring this stuff for now
  value: _value,
  onChange: _onChange,
  ...props
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(defaultValue ?? "");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    // if (onChange) onChange(event);
  };

  useLayoutEffect(() => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = "inherit";
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      {...props}
      value={value}
      onChange={handleChange}
      ref={textAreaRef}
    />
  );
};

export const ImageDescriptionInput: React.FC<
  TextareaHTMLAttributes<HTMLTextAreaElement>
> = (props) => {
  return (
    <AutoTextarea
      {...props}
      className="w-full resize-none rounded-b-md border border-none bg-slate-700 px-4 py-2 text-lg outline-none"
      placeholder="Add a description..."
      maxLength={500}
    />
  );
};

const CopyLinkMenuItem = () => {
  return (
    <DropdownMenuItem className="gap-2">
      <TbLink /> Copy link
    </DropdownMenuItem>
  );
};

const DownloadImageMenuItem: React.FC<{
  post: Post;
}> = ({ post }) => {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [url, setUrl] = useState(post.imageUrl);
  const [fileName, setFileName] = useState<string | true>(true);

  const handleClick = () => {
    if (!anchorRef.current) return;
    anchorRef.current.click();
  };

  useEffect(() => {
    void (async () => {
      const response = await fetch(post.imageUrl);
      const blob = await response.blob();
      const newUrl = URL.createObjectURL(blob);
      console.log("newUrl", newUrl);
      setUrl((oldUrl) => {
        // XXX: cursed setState callback ;-;
        // (but we need to revoke the old url somehow)
        if (oldUrl !== post.imageUrl) URL.revokeObjectURL(oldUrl);
        return newUrl;
      });
    })();
  }, [post.imageUrl, setUrl]);

  useEffect(() => {
    invariant(
      post.imageUrl.includes("."),
      "image url doesn't have a file extension"
    );
    const fileExtension = post.imageUrl.split(".").pop()!;
    setFileName(`${post.title || post.id} - OrgMe.${fileExtension}`);
  }, [post.imageUrl, setFileName, post.id, post.title]);

  return (
    <DropdownMenuItem onClick={handleClick} className="gap-2">
      <a ref={anchorRef} href={url} download={fileName} className="hidden">
        Copy link
      </a>
      <TbDownload /> Download
    </DropdownMenuItem>
  );
};

export const ImageDropdownMenu: React.FC<
  PropsWithChildren<
    {
      post: Post;
    } & DropdownMenuTriggerProps
  >
> = ({ children, post, ...props }) => {
  const { user } = useUser();
  const isOwner = user && user.id === post.authorId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger {...props}>{children}</DropdownMenuTrigger>

      <DropdownMenuContent>
        <CopyLinkMenuItem />
        <DownloadImageMenuItem post={post} />

        <DropdownMenuSeparator />
        {isOwner ? (
          <DropdownMenuItem className="gap-2">
            <TbTrash /> Delete
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="gap-2">
            <TbFlag /> Report
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
