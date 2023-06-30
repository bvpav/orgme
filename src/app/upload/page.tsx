"use client";

import { useState } from "react";
import invariant from "tiny-invariant";

import { ImageDescriptionInput, ImageRectangle } from "~/components/image";
import { Button } from "~/components/ui/button";
import { UploadDropzone } from "~/utils/uploadthing";
import { createPost } from "./actions";
import { VisibilitySelect } from "../i/[postId]/components";
import { TbInfoCircle, TbPlus } from "react-icons/tb";
import { useToast } from "~/components/ui/use-toast";

export default function Home() {
  const [file, setFile] = useState<{ url: string; key: string } | null>(null);
  const { toast } = useToast();

  const visibility = "public";

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
              toast({
                title: "Unable to upload image",
                description: error.message,
                variant: "destructive",
              });
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
              <Button
                variant="ghost"
                disabled
                className="h-7 w-fit gap-3 px-2 text-xs"
              >
                <TbPlus /> Add tag
              </Button>
            </fieldset>
            <fieldset className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Upload</h2>
              {/* TODO: maybe add <label /> */}
              <VisibilitySelect defaultValue={visibility} />
              <p className="mb-4 mt-1 flex items-center gap-1 text-sm font-light text-gray-200">
                <TbInfoCircle />{" "}
                {visibility === "public"
                  ? "Anyone can see this image."
                  : visibility === "private"
                  ? "Only you can see this image."
                  : "Anyone with the link can see this image."}
              </p>
              <Button size="lg">Upload {visibility}</Button>
            </fieldset>
          </div>
        </form>
      )}
    </main>
  );
}
