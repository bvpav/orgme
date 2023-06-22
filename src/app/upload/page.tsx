"use client";

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";
import {
  TextareaHTMLAttributes,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import invariant from "tiny-invariant";

import { UploadButton, UploadDropzone } from "~/utils/uploadthing";
import { createPost } from "./actions";
import Image from "next/image";
import { ImageRectangle } from "~/components/image";

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

export default function Home() {
  const [file, setFile] = useState<{ url: string; key: string } | null>(null);

  return (
    <main className="grid w-screen place-content-center">
      {file === null ? (
        <section className="mt-16 flex w-full max-w-md flex-col items-center justify-between rounded-md bg-white p-10 text-center text-black shadow-sm sm:p-24">
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (!res) return;

              invariant(
                res.length === 1,
                `expected exactly one file, but somehow uploaded ${res.length}`
              );
              setFile({
                url: res[0].fileUrl,
                key: res[0].fileKey,
              });
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        </section>
      ) : (
        <form
          action={createPost}
          className="flex flex-col items-start justify-center gap-5 p-5 md:flex-row"
        >
          <input type="hidden" value={file.key} name="fk" />
          <fieldset className="flex max-w-xl flex-1 flex-col gap-3">
            <input
              className="w-full border-none bg-transparent text-2xl font-bold placeholder-gray-400/50 outline-none placeholder:italic"
              name="title"
              placeholder="Add a title..."
            />
            <div className="flex flex-col shadow-sm">
              <ImageRectangle url={file.url} alt="the image to be uploaded" />
              <AutoTextarea
                className="w-full resize-none rounded-b-md border border-none bg-slate-700 px-4 py-2 text-lg outline-none"
                name="description"
                placeholder="Add a description..."
                maxLength={500}
              />
            </div>
          </fieldset>
          <div className="flex-2 flex flex-col gap-4 md:flex-col-reverse md:gap-8">
            <fieldset className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Tags</h2>
              <p>tags here...</p>
            </fieldset>
            <fieldset className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Upload</h2>
              <p>visibility here...</p>
              <button className="flex items-center space-x-2 rounded-md bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2">
                Upload public
              </button>
            </fieldset>
          </div>
        </form>
      )}
    </main>
  );
}
