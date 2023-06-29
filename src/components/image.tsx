"use client";

import clsx from "clsx";
import React, {
  PropsWithChildren,
  TextareaHTMLAttributes,
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

export const ImageRectangleMenu: React.FC<{
  postId: string;
}> = ({ postId }) => {
  return (
    <ImageDropdownMenu
      postId={postId}
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

export const ImageDropdownMenu: React.FC<
  PropsWithChildren<
    {
      postId?: string;
      deletePost?: React.FC<PropsWithChildren>;
    } & DropdownMenuTriggerProps
  >
> = ({
  children,
  deletePost: DeletePostTrigger,
  asChild = false,
  ...props
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger {...props}>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="gap-2">
          <TbLink /> Copy link
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <TbDownload /> Download
        </DropdownMenuItem>

        {DeletePostTrigger === undefined ? (
          <DropdownMenuItem className="gap-2">
            <TbFlag /> Report
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuSeparator />
            <DeletePostTrigger>
              <DropdownMenuItem className="gap-2">
                <TbTrash /> Delete post
              </DropdownMenuItem>
            </DeletePostTrigger>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
