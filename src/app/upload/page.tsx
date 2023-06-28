"use client";

import "@uploadthing/react/styles.css";
import { useState } from "react";
import invariant from "tiny-invariant";

import { ImageDescriptionInput, ImageRectangle } from "~/components/image";
import { Button } from "~/components/ui/button";
import { UploadDropzone } from "~/utils/uploadthing";
import { createPost } from "./actions";

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
              <ImageDescriptionInput name="description" />
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
              <Button size="lg">Upload public</Button>
            </fieldset>
          </div>
        </form>
      )}
    </main>
  );
}
