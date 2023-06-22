import classNames from "classnames";
import Image from "next/image";
import { TbDots } from "react-icons/tb";

export const ImageRectangle: React.FC<{
  url: string;
  zoomable?: boolean;
  alt: string;
  menu?: React.ReactNode;
}> = ({ url, zoomable = true, alt, menu }) => {
  return (
    <div className="relative flex h-full min-h-[350px] w-full items-center overflow-clip rounded-t-md bg-black object-cover">
      <img src={url} alt={alt} className="w-full" />
      <div
        className={classNames(
          "group absolute top-0 h-full w-full",
          zoomable ? "cursor-zoom-in" : "cursor-pointer"
        )}
      >
        {menu !== undefined && (
          <button
            type="button"
            className="absolute right-0 top-0 mr-3 mt-3 hidden aspect-square place-items-center rounded bg-black/30 text-2xl group-hover:grid"
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
