import Image from "next/image";
import type { MDXComponents } from "mdx/types";

type FigureProps = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

function Figure({ src, width, height, alt, caption }: FigureProps) {
  return (
    <figure className="my-10">
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        sizes="(min-width: 1024px) 768px, 100vw"
        className="h-auto w-full rounded-lg border border-border"
      />
      {caption ? (
        <figcaption className="mt-3 font-mono text-sm text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

type PhoneGalleryProps = {
  images: { src: string; width: number; height: number; alt: string }[];
  caption?: string;
};

function PhoneGallery({ images, caption }: PhoneGalleryProps) {
  return (
    <figure className="my-10">
      <div className="grid grid-cols-3 items-start gap-3 sm:gap-6">
        {images.map((image) => (
          <Image
            key={image.src}
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            sizes="(min-width: 768px) 240px, 33vw"
            className="h-auto w-full rounded-xl border border-border"
          />
        ))}
      </div>
      {caption ? (
        <figcaption className="mt-3 font-mono text-sm text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

const components: MDXComponents = { Figure, PhoneGallery };

export function useMDXComponents(): MDXComponents {
  return components;
}
