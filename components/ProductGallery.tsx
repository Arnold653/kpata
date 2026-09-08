"use client";

import { useState } from "react";

type ImageItem = { url: string };

export default function ProductGallery({
  images,
  alt,
}: {
  images: ImageItem[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-square w-full bg-neutral-100" />;
  }

  return (
    <div>
      <div className="aspect-square w-full bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[activeIndex].url}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 pt-3 [scrollbar-width:none]">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActiveIndex(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                activeIndex === i ? "border-navy" : "border-neutral-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
