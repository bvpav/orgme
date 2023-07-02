"use client";

import { useUser } from "@clerk/nextjs";
import { AlertDialogTriggerProps } from "@radix-ui/react-alert-dialog";
import { DialogTriggerProps } from "@radix-ui/react-dialog";
import {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
} from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, {
  PropsWithChildren,
  TextareaHTMLAttributes,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  TbDots,
  TbDownload,
  TbEyeOff,
  TbFlag,
  TbLink,
  TbLoader2,
  TbLock,
  TbTrash,
  TbWorld,
} from "react-icons/tb";
import { deletePost } from "~/app/i/[postId]/actions";
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
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "./ui/use-toast";

type Post = {
  id: string;
  authorId: string;
  imageUrl: string;
  title: string;
  // FIXME: dont overfetch :(
  // imageFK: never;
};

const DeleteImageDialogContent: React.FC<{
  post: Post;
}> = ({ post }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setIsLoading(true);
    deletePost({ postId: post.id })
      .then(() => {
        toast({
          title: "Image deleted",
          description: "Your image has been deleted.",
        });
        router.push("/");
      })
      .catch(() =>
        toast({
          title: "Unable to delete image",
          description: "Something went wrong, please try again later.",
          variant: "destructive",
        })
      )
      .finally(() => setIsLoading(false));
  };

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
        <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
          {!isLoading ? (
            "Delete"
          ) : (
            <>
              <TbLoader2 className="mr-2 animate-spin" /> Deleting...
            </>
          )}
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
      <DeleteImageDialogContent post={post} />
    </AlertDialog>
  );
};

export const ImageRectangleMenuTrigger: React.FC<
  Exclude<DropdownMenuTriggerProps, "className">
> = (props) => {
  return (
    <DropdownMenuTrigger
      className="absolute right-0 top-0 mr-3 mt-3 grid aspect-square place-items-center rounded bg-black/30 text-2xl transition-transform active:scale-95"
      {...props}
    >
      <TbDots />
    </DropdownMenuTrigger>
  );
};

const ImageFullScreenDialog: React.FC<
  {
    url: string;
    alt: string;
    enabled: boolean;
    children: React.ReactNode;
  } & DialogTriggerProps
> = ({ enabled, url, alt, children, ...props }) => {
  return enabled ? (
    <Dialog>
      <DialogTrigger {...props}>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl rounded-none border-none bg-transparent p-0">
        <img src={url} alt={alt} className="w-full" />
      </DialogContent>
    </Dialog>
  ) : (
    children
  );
};

export const ImageRectangle: React.FC<{
  url: string;
  zoomable?: boolean;
  alt: string;
  menu?: React.ReactNode;
}> = ({ url, zoomable = true, alt, menu }) => {
  return (
    <ImageFullScreenDialog url={url} alt={alt} enabled={zoomable} asChild>
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
      </div>
    </ImageFullScreenDialog>
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
  const { toast } = useToast();
  return (
    <DropdownMenuItem
      onClick={() =>
        void copyToClipboard(`${window.location.origin}/i/${postId}`).then(() =>
          toast({
            // FIXME: make typescript happy
            title: (
              <div className="flex items-center gap-2">
                <TbLink /> Link copied
              </div>
            ) as any,
          })
        )
      }
      className="gap-2"
    >
      <TbLink /> Copy link
    </DropdownMenuItem>
  );
};

const DownloadImageMenuItem: React.FC<{
  post: Post;
}> = ({ post }) => {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  return (
    <DropdownMenuItem
      onClick={() => anchorRef.current?.click()}
      asChild
      className="gap-2"
    >
      <a
        ref={anchorRef}
        href={`/api/download?i=${encodeURIComponent(post.id)}`}
        rel="noopener noreferrer nofollow"
      >
        <TbDownload /> Download
      </a>
    </DropdownMenuItem>
  );
};

export const ImageDropdownMenuContent: React.FC<{
  post: Post;
}> = ({ post }) => {
  const { user } = useUser();
  const isOwner = user && user.id === post.authorId;

  return (
    <DropdownMenuContent>
      <CopyLinkMenuItem postId={post.id} />
      <DownloadImageMenuItem post={post} />

      <DropdownMenuSeparator />
      {isOwner ? (
        <AlertDialogTrigger asChild>
          <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-700">
            <TbTrash /> Delete
          </DropdownMenuItem>
        </AlertDialogTrigger>
      ) : (
        <DropdownMenuItem disabled className="gap-2">
          <TbFlag /> Report
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  );
};

export const ImageDropdownMenuRoot: React.FC<
  PropsWithChildren<
    {
      post: Post;
    } & DropdownMenuProps
  >
> = ({ children, post, ...props }) => {
  return (
    <AlertDialog>
      <DropdownMenu {...props}>
        {children}
        <ImageDropdownMenuContent post={post} />
      </DropdownMenu>

      <DeleteImageDialogContent post={post} />
    </AlertDialog>
  );
};

export const ImageDropdownMenu: React.FC<
  PropsWithChildren<
    {
      post: Post;
    } & DropdownMenuTriggerProps
  >
> = ({ children, post, ...props }) => {
  return (
    <ImageDropdownMenuRoot post={post} modal>
      <DropdownMenuTrigger {...props}>{children}</DropdownMenuTrigger>
    </ImageDropdownMenuRoot>
  );
};

export const VisibilityText: React.FC<{
  visibility: "public" | "private" | "unlisted";
}> = ({ visibility }) => {
  return (
    <span className="flex items-center gap-1">
      {visibility === "public" ? (
        <>
          <TbWorld /> Public
        </>
      ) : visibility === "private" ? (
        <>
          <TbLock /> Private
        </>
      ) : (
        <>
          <TbEyeOff /> Unlisted
        </>
      )}
    </span>
  );
};
