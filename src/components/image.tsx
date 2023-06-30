"use client";

import { useUser } from "@clerk/nextjs";
import { AlertDialogTriggerProps } from "@radix-ui/react-alert-dialog";
import { DropdownMenuTriggerProps } from "@radix-ui/react-dropdown-menu";
import { Portal } from "@radix-ui/react-portal";
import clsx from "clsx";
import React, {
  PropsWithChildren,
  TextareaHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { TbDots, TbDownload, TbFlag, TbLink, TbTrash } from "react-icons/tb";
import invariant from "tiny-invariant";
import { copyToClipboard } from "~/utils/clipboard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Post = {
  id: string;
  authorId: string;
  imageUrl: string;
  title: string;
  // FIXME: dont overfetch :(
  // imageFK: never;
};

const DeleteImageContent: React.FC<{
  post: Post;
}> = ({ post }) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Delete{" "}
          {post.title ? (
            <span className="font-extrabold">{post.title}</span>
          ) : (
            "image"
          )}
          ?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-base">
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => alert("deleting...")}>
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export const DeleteImageDialog: React.FC<
  {
    post: Post;
  } & AlertDialogTriggerProps
> = ({ post, ...props }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger {...props} />
      <DeleteImageContent post={post} />
    </AlertDialog>
  );
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

const CopyLinkMenuItem: React.FC<{
  postId: string;
}> = ({ postId }) => {
  return (
    <DropdownMenuItem
      onClick={() =>
        void copyToClipboard(`${window.location.origin}/i/${postId}`).then(() =>
          alert("Copied!")
        )
      }
      className="gap-2"
    >
      <TbLink /> Copy link
    </DropdownMenuItem>
  );
};

// FIXME: this is a bit cursed
//
// We need to download the image, however we can't just use the image url
// because s3 doesn't set the Content-Disposition header to attachment.
//
// We can use the <a download> attribute, but that doesn't work with cross-origin
// images, so we need to download the image and create a blob url, which we can
// then use as the href for the <a download> element.
const DownloadImageMenuItem: React.FC<{
  post: Post;
}> = ({ post }) => {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [url, setUrl] = useState(post.imageUrl);
  const [fileName, setFileName] = useState<string | true>(true);

  const handleClick = (e: React.MouseEvent) => {
    if (!anchorRef.current) return;
    anchorRef.current.click();
    e.stopPropagation();
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
    const fileExtension = post.imageUrl.split(".").at(-1)!;
    setFileName(`${post.title || post.id} - OrgMe.${fileExtension}`);
  }, [post.imageUrl, setFileName, post.id, post.title]);

  return (
    <>
      <Portal>
        <a
          ref={anchorRef}
          href={url}
          download={fileName}
          target={url.startsWith("blob:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="hidden"
        >
          Download
        </a>
      </Portal>
      <DropdownMenuItem onClick={handleClick} className="gap-2">
        <TbDownload /> Download
      </DropdownMenuItem>
    </>
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
    <AlertDialog>
      <DropdownMenu modal={true}>
        <DropdownMenuTrigger {...props}>{children}</DropdownMenuTrigger>

        <DropdownMenuContent>
          <CopyLinkMenuItem postId={post.id} />
          <DownloadImageMenuItem post={post} />

          <DropdownMenuSeparator />
          {isOwner ? (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="gap-2">
                <TbTrash /> Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          ) : (
            <DropdownMenuItem disabled className="gap-2">
              <TbFlag /> Report
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteImageContent post={post} />
    </AlertDialog>
  );
};
