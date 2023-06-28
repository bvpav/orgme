"use client";

import clsx from "clsx";
import {
  TextareaHTMLAttributes,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { TbDots } from "react-icons/tb";

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
        {menu !== undefined && (
          <button
            type="button"
            className="absolute right-0 top-0 mr-3 mt-3 hidden aspect-square place-items-center rounded bg-black/30 text-2xl transition-transform active:scale-95 group-hover:grid"
          >
            <TbDots />
          </button>
        )}
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

const AutoTextarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = (
  props
) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(props.defaultValue ?? "");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    if (props.onChange) props.onChange(event);
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
