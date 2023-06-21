import Image from "next/image";

export const ImageRectangle: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div className="relative grid h-full min-h-[350px] w-full place-content-center overflow-clip rounded-t-md bg-black object-cover">
      <img src={url} alt="the image to be uploaded" />
      {/* <Image
        src={url}
        alt="the image to be uploaded"
        fill
        className="object-cover"
      /> */}
    </div>
  );
};
