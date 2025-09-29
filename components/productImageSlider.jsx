import { useState } from "react";

export default function ImageSlider({ images = [] }) {
  const [activeImage, setActiveImage] = useState(images[0] || "");

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-xl">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* ✅ Active Image */}
      <div className="bg-violet-50 w-full aspect-square relative rounded-2xl shadow-md overflow-hidden">
        <img
          src={activeImage}
          alt="product"
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* ✅ Thumbnails */}
      <div className="flex gap-3 justify-center flex-wrap">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`thumb-${index}`}
            onClick={() => setActiveImage(img)}
            className={`h-[70px] w-[70px] object-cover rounded-lg cursor-pointer border-2 transition ${
              activeImage === img
                ? "border-violet-500 scale-105"
                : "border-transparent hover:border-violet-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
