"use client";
import { useState } from 'react';
import img1 from "../Images/vcac.jpeg"
import img2 from "../Images/image2.jpeg"
import img3 from "../Images/background.png"
import Image from 'next/image';
const images = [
  { "src": {img1}, alt: 'Image 1', text: 'Record your audio to make us understand the accent' },
  { "src": {img2}, alt: 'Image 2', text: 'Join the meet' },
  { "src": {img3}, alt: 'Image 3', text: 'your voice will be translated to the desired language' },
];



export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative w-full">
      <div id="image-slider" className="relative w-full h-72 overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center transition-opacity duration-500 ${currentIndex === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image src={img3} alt={image.alt} className="w-48 h-48 rounded-full object-cover shadow-lg" />
            <div className="mt-4 text-lg text-gray-700 text-center">{image.text}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button className="px-3 py-1 bg-white text-black rounded-full mx-2" onClick={handlePrev}>&lt;</button>
        <button className="px-3 py-1 bg-white text-black rounded-full mx-2" onClick={handleNext}>&gt;</button>
      </div>
    </div>
  );
}
