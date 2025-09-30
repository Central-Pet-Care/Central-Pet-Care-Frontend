import { useState } from "react";

export default function ImageSlider({ images }) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="relative w-full h-[28rem] md:h-[34rem] bg-gray-100 flex flex-col justify-start rounded-lg">
      {/* Image wrapper */}
      <div className="relative w-full flex justify-center items-start bg-gray-100 rounded-t-lg p-2">
        {/* Main Image */}
        <img
          src={images[activeImage]}
          className="max-h-[30rem] w-auto object-contain rounded-lg"
        />
      </div>

      {/* Floating Thumbnail Bar */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 
                   w-[90%] max-w-lg h-[65px] 
                   backdrop-blur-lg bg-gradient-to-t from-black/40 to-black/10 
                   rounded-xl shadow-md"
      >
        <div className="w-full h-full flex items-center justify-center overflow-x-auto px-2">
          {images.map((img, index) => (
            <img
              key={index}
              onClick={() => setActiveImage(index)}
              src={img}
              className={`w-14 h-14 object-cover rounded-full cursor-pointer mx-2 border-2 transition-all duration-200 ${
                index === activeImage
                  ? "border-purple-500 scale-105"
                  : "border-white"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
