"use client";

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";
import { useState } from "react";
import invariant from "tiny-invariant";

import { UploadButton } from "~/utils/uploadthing";
import { createPost } from "./actions";

export default function Home() {
  const [file, setFile] = useState<{ url: string; key: string } | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {file === null ? (
        <UploadButton
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
      ) : (
        <form action={createPost} className="flex flex-col gap-3">
          <input type="hidden" value={file.key} name="fk" />
          <input
            className="rounded-md border border-gray-300 text-black placeholder:text-gray-600"
            name="title"
            placeholder="Add a title..."
          />
          <img src={file.url} className="rounded-md" />
          <textarea
            className="rounded-md border border-gray-300 text-black placeholder:text-gray-600"
            name="description"
            placeholder="Add a description..."
          />
          <button className="rounded-md bg-blue-500 p-2 text-white">
            Upload public
          </button>
        </form>
      )}
    </main>
  );
}
